import { prepareApp } from '@winkgroup/webserver';
import CronRunnerWithWebSocket from '../src/runnerWebSocket';
import path from 'path';
import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import ConsoleLog, { ConsoleLogLevel } from '@winkgroup/console-log';

class DemoCronRunner extends CronRunnerWithWebSocket {
    async _run() {
        console.info('demo runner, running!!');
    }
}

const app = express();

prepareApp(app, 'myApp');
app.get('/', (req: any, res: any) =>
    res.sendFile(path.join(__dirname, './controlPage.html')),
);

const server = http.createServer(app);
const ioApp = new IOServer(server, {
    cors: {
        origin: true,
    },
});

new DemoCronRunner(5, ioApp.of('/cron-runner'), {
    consoleLog: new ConsoleLog({
        verbosity: ConsoleLogLevel.DEBUG,
        prefix: 'DemoCronRunner',
    }),
});

server.listen(8080);
console.log(
    'VISIT http://127.0.0.1:8080/ and open your browser console log to test it!',
);
