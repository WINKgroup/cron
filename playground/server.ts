import Webserver from '@winkgroup/webserver';
import CronRunnerWithWebSocket from '../src/runnerWebSocket';
import path from 'path';
import ConsoleLog, { LogLevel } from '@winkgroup/console-log';

class DemoCronRunner extends CronRunnerWithWebSocket {
    async _run() {
        console.info('demo runner, running!!');
    }
}

const webserver = new Webserver({ name: 'Demo Server', hasSocket: true });
new DemoCronRunner(5, webserver.ioApp!.of('/cron-runner'), {
    consoleLog: new ConsoleLog({
        verbosity: LogLevel.DEBUG,
        prefix: 'DemoCronRunner',
    }),
});
webserver.app.get('/', (req: any, res: any) =>
    res.sendFile(path.join(__dirname, './controlPage.html'))
);

console.log(
    'VISIT http://127.0.0.1:8080/ and open your browser console log to test it!'
);
webserver.listen();
