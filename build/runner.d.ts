import ConsoleLog from "@winkgroup/console-log";
import Cron from ".";
import { CronRunnerState } from "./common";
export interface CronRunnerInput {
    consoleLog: ConsoleLog;
    startActive: boolean;
    forceRun: boolean;
}
export default abstract class CronRunner {
    protected _active: boolean;
    protected _setup: boolean;
    protected _interval?: any;
    forceRun: boolean;
    consoleLog: ConsoleLog;
    cron: Cron;
    constructor(everySeconds: number, inputOptions?: Partial<CronRunnerInput>);
    protected abstract _run(): Promise<void>;
    get active(): boolean;
    run(force?: boolean): Promise<void>;
    setup(): Promise<void>;
    start(): Promise<void>;
    stop(force?: boolean): Promise<void>;
    getState(): CronRunnerState;
}
