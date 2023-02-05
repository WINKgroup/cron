export interface CronRunnerState {
    active: boolean;
    running: boolean;
    everySeconds: number;
    lastRunAt: number;
}
