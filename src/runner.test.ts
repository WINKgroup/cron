import ConsoleLog, { ConsoleLogLevel } from '@winkgroup/console-log';
import CronRunner from './runner';
import { waitForMs } from './waitFor';

ConsoleLog.verbosity = ConsoleLogLevel.DEBUG;

class DummyCronRunner extends CronRunner {
    async _run() {
        await waitForMs(1000);
    }
}

test('stop is effective', async () => {
    const cron = new DummyCronRunner(1);
    await waitForMs(2000);
    await cron.stop();
}, 10000);
