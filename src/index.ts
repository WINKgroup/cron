import ConsoleLog from '@winkgroup/console-log';
import { CronRunnerState } from './common';
import CronRunner, { CronRunnerInput } from './runner';
import CronRunnerWithSocket, {
    CronRunnerWithSocketInput,
} from './runnerWebSocket';

export default class Cron {
    everySeconds: number;
    lastRunAt = 0;
    private isRunning = false;
    consoleLog: ConsoleLog;

    constructor(everySeconds = 0, consoleLog?: ConsoleLog) {
        this.everySeconds = everySeconds;
        this.consoleLog = consoleLog
            ? consoleLog
            : new ConsoleLog({ prefix: 'Cron' });
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
        this.consoleLog.debug(abort ? 'cron aborted' : 'cron ended running');
        if (!abort) this.lastRunAt = new Date().getTime();
    }

    async run(task: () => Promise<void>, force = false) {
        if (!this.tryStartRun(force)) return;
        await task();
        this.runCompleted();
    }

    static comeBackIn(milliseconds: number) {
        let epoch = new Date().getTime();
        epoch += milliseconds;
        return new Date(epoch).toISOString();
    }
}

export {
    CronRunnerState,
    CronRunner,
    CronRunnerInput,
    CronRunnerWithSocket,
    CronRunnerWithSocketInput,
};
