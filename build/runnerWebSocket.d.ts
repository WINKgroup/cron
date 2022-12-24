import CronRunner, { CronRunnerInput } from "./runner";
import { Namespace, Server as IOServer } from 'socket.io';
export interface CronRunnerWithSocketInput extends CronRunnerInput {
    ioNamespace: string;
}
export default abstract class CronRunnerWithWebSocket extends CronRunner {
    io: Namespace;
    constructor(everySeconds: number, ioServer: IOServer, inputOptions?: Partial<CronRunnerInput>);
    setIo(ioServer: IOServer, namespace?: string): void;
    isTokenValid(token: string): boolean;
    run(force?: boolean): Promise<void>;
    start(): Promise<void>;
    stop(force?: boolean): Promise<void>;
}
