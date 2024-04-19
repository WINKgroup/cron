export interface CronRunnerState {
    active: boolean;
    running: boolean;
    everySeconds: number;
    defaultEverySeconds: number;
    lastRunAt: number;
}
