import ConsoleLog from '@winkgroup/console-log';
import { getDuration } from '@winkgroup/misc';
import _ from 'lodash';

export interface CronOptions {
    consoleLog: ConsoleLog;
    backoffFunction?: (currentWaitingSeconds: number) => number;
    maxEverySeconds?: number;
}

export default class Cron {
    defaultEverySeconds: number;
    everySeconds: number;
    backoffFunction?: (currentWaitingSeconds: number) => number;
    lastRunAt = 0;
    private isRunning = false;
    consoleLog: ConsoleLog;

    constructor(everySeconds = 0, inputOptions?: Partial<CronOptions>) {
        this.everySeconds = everySeconds;
        this.defaultEverySeconds = everySeconds;
        const options: CronOptions = _.defaults(inputOptions, {
            consoleLog: new ConsoleLog({ prefix: 'Cron' }),
        });

        this.consoleLog = options.consoleLog;
        if (options.backoffFunction)
            this.backoffFunction = options.backoffFunction;
        else if (options.maxEverySeconds)
            this.backoffFunction = (currentWaitingSeconds: number) => {
                return Math.min(
                    currentWaitingSeconds * currentWaitingSeconds,
                    options.maxEverySeconds!,
                );
            };
    }

    get running() {
        return this.isRunning;
    }

    // expressed in seconds
    nextRunIn() {
        const now = new Date().getTime();
        const nextRun = this.lastRunAt + this.everySeconds * 1000;
        return nextRun > now ? (nextRun - now) / 1000 : 0;
    }

    /***
     * every time you call debounce method the timer is trigger, next call should wait the cron time
     * @return false => you can run your task, true => you should wait
     */
    debounce() {
        if (this.isRunning) return true;
        const nextRun = this.nextRunIn();

        if (nextRun === 0) {
            this.lastRunAt = new Date().getTime();
            return false;
        }

        return true;
    }

    tryStartRun(force?: boolean) {
        const now = new Date().getTime();
        if (
            !force &&
            (this.isRunning ||
                (now - this.lastRunAt) / 1000 < this.everySeconds)
        ) {
            if (this.consoleLog && this.isRunning)
                this.consoleLog.debug('cron still running: not starting again');
            return false;
        }
        if (this.consoleLog) this.consoleLog.debug('cron start running...');
        this.isRunning = true;
        return true;
    }

    runCompleted(abort = false) {
        this.isRunning = false;
        this.consoleLog.debug(abort ? 'task aborted' : 'task completed');
        this.lastRunAt = new Date().getTime();
        if (abort && this.backoffFunction) {
            this.everySeconds = this.backoffFunction(this.everySeconds);
            this.consoleLog.debug(
                'waiting time updated to: ' + getDuration(this.everySeconds),
            );
        } else if (this.everySeconds !== this.defaultEverySeconds) {
            this.everySeconds = this.defaultEverySeconds;
            this.consoleLog.debug(
                'resetting waiting time to: ' + getDuration(this.everySeconds),
            );
        }
    }

    async run(task: () => Promise<void>, force = false) {
        if (!this.tryStartRun(force)) return;
        try {
            await task();
        } catch (e) {
            this.runCompleted(true);
            throw e;
        }

        this.runCompleted();
    }

    static comeBackIn(milliseconds: number) {
        let epoch = new Date().getTime();
        epoch += milliseconds;
        return new Date(epoch).toISOString();
    }
}
