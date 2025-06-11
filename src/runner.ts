import ConsoleLog from '@winkgroup/console-log';
import _ from 'lodash';
import { CronRunnerState } from './common';
import Cron, { CronOptions } from './cron';

export interface CronRunnerInput extends Partial<CronOptions> {
    startActive: boolean;
    forceRun: boolean;
}

export default abstract class CronRunner {
    protected _active = false;
    protected _setup = false;
    protected _interval?: any;
    forceRun: boolean;
    consoleLog: ConsoleLog;
    cron: Cron;

    constructor(everySeconds: number, inputOptions?: Partial<CronRunnerInput>) {
        const options = _.defaults(inputOptions, {
            startActive: true,
            forceRun: false,
        });

        this.forceRun = options.forceRun;
        this.consoleLog = options.consoleLog
            ? options.consoleLog
            : new ConsoleLog({ prefix: 'CronRunner' });
        this.cron = new Cron(everySeconds, options);
        if (options.startActive) this.start();
    }

    protected abstract _run(): Promise<void>;
    get active() {
        return this._active;
    }

    async run(force = false) {
        if (!this.cron.tryStartRun(force)) return;
        await this._run();
        this.cron.runCompleted();
    }

    async setup() {
        // for an eventually intial async setup
        this._setup = true;
    }

    async start() {
        if (!this._setup) await this.setup();
        if (this._active) {
            this.consoleLog.warn('cron already started, not starting it again');
            return;
        }
        this._interval = setInterval(
            async () => this.run(this.forceRun),
            this.cron.defaultEverySeconds * 1000,
        );
        this._active = true;
        this.consoleLog.debug('cron activated');
        this.run();
    }

    async stop(force = false) {
        clearInterval(this._interval);
        this._interval = undefined;
        this._active = false;
        this.consoleLog.debug('cron deactivated');
    }

    getState() {
        const state: CronRunnerState = {
            active: this._active,
            running: this.cron.running,
            everySeconds: this.cron.everySeconds,
            defaultEverySeconds: this.cron.defaultEverySeconds,
            lastRunAt: this.cron.lastRunAt,
        };

        return state;
    }
}
