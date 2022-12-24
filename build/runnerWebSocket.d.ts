import CronRunner, { CronRunnerInput } from "./runner";
import { Namespace } from 'socket.io';
export interface CronRunnerWithSocketInput extends CronRunnerInput {
    ioNamespace: Namespace;
}
export default abstract class CronRunnerWithWebSocket extends CronRunner {
    io: Namespace;
    constructor(everySeconds: number, ioNamespace: Namespace, inputOptions?: Partial<CronRunnerInput>);
    setIo(): void;
    isTokenValid(token: string): boolean;
    run(force?: boolean): Promise<void>;
    start(): Promise<void>;
    stop(force?: boolean): Promise<void>;
}
