import ConsoleLog from "@winkgroup/console-log";
export default class Cron {
    everySeconds: number;
    lastRunAt: number;
    private isRunning;
    consoleLog: ConsoleLog;
    constructor(everySeconds?: number, consoleLog?: ConsoleLog);
    get running(): boolean;
    tryStartRun(force?: boolean): boolean;
    runCompleted(): void;
    static comeBackIn(milliseconds: number): string;
}
