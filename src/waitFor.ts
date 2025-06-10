import ConsoleLog from '@winkgroup/console-log';
import _ from 'lodash';

export function waitForMs(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export interface WaitForOptions {
    consoleLog?: ConsoleLog;
    timeoutInSeconds: number;
    everyMilliseconds: number;
    dontThrowError: boolean;
}

export default class WaitFor {
    isCompleted: () => boolean;
    consoleLog?: ConsoleLog;
    readonly timeoutInSeconds: number;
    readonly everyMilliseconds: number;
    dontThrowError: boolean;
    protected _interval?: NodeJS.Timeout;

    constructor(
        isCompleted: () => boolean,
        inputOptions?: Partial<WaitForOptions>,
    ) {
        const options: WaitForOptions = _.defaults(inputOptions, {
            timeoutInSeconds: 0,
            everyMilliseconds: 100,
            dontThrowError: false,
        });
        this.isCompleted = isCompleted;
        this.consoleLog = options.consoleLog;
        this.timeoutInSeconds = options.timeoutInSeconds;
        this.everyMilliseconds = options.everyMilliseconds;
        this.dontThrowError = options.dontThrowError;
    }

    run() {
        const limit = this.timeoutInSeconds
            ? new Date().getTime() + this.timeoutInSeconds * 1000
            : 0;

        return new Promise<boolean>((resolve, reject) => {
            const end = (result: boolean) => {
                if (this._interval) clearInterval(this._interval);
                resolve(result);
            };

            if (this.isCompleted()) {
                end(true);
                return;
            }
            this._interval = setInterval(() => {
                if (this.isCompleted()) end(true);
                else if (limit && limit < new Date().getTime()) {
                    if (this.dontThrowError) end(false);
                    else {
                        if (this._interval) clearInterval(this._interval);
                        reject();
                    }
                }
            }, this.everyMilliseconds);
        });
    }

    static when(
        isCompleted: () => boolean,
        inputOptions?: Partial<WaitForOptions>,
    ) {
        const waitFor = new WaitFor(isCompleted, inputOptions);
        return waitFor.run();
    }
}
