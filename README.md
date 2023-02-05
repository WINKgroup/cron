# cron
Helper functions to manage cron tasks

## Install
```
npm install @winkgroup/cron
```

or

```
yarn add @winkgroup/cron
```

## Overview
We provide 3 main classes:
- **CronRunner**: with internal setInterval
- **Cron**: basic class without internal setInterval
- **CronRunnerWithWebSocket**: with internal setInterval and commands to be controlled through websocket

## CronRunner
It is an abstract class to need to extend. The abstract method you need to extend is ```_run() => Promise<void>```.
Here an example:

```ts
import CronRunner from '@winkgroup/cron'

class DemoCronRunner extends CronRunner {
    constructor() {
        super(5)
    }

    async _run() {
        console.info('something should be run every 5 seconds')
    }
}

const demoCron = new DemoCronRunner() // immidiatly starting cron
```

super contructor has these params:
```super(everySeconds, [options])```
options in the constructor are:
- *consoleLog*: an instance of [ConsoleLog](https://github.com/WINKgroup/console-log) class
- *startActive*: if true the cron is active at start (default: true)
- *forceRun*: if true it runs the periodic task no matter if the previous task is not completed (default: false)


other inherited methods you can overload are:
- ```start() => Promise<void>```: to start cron. It is called by default when a new object is instanciated
- ```stop() => Promise<void>```: to stop the period task to run
- ```run([force]) => Promise<void>```: to manually call the periodic task. If *force* is true, than the task will run even if the previous task is not completed or the cooldown period is not passed
- ```setup() => Promise<void>```: you can overload this method to run some previous asyncronous tasks before the running of the first task
- ```getState() => CronRunnerState```: CronRunnerState is an object like this
```js
{
  active: boolean;
  running: boolean;
  everySeconds: number;
  lastRunAt: number;
}
```

## Cron
This is the simplest class. It doesn't have its own setInterval running and the tipical scenario to use this class is when you don't want to manager different intervals to reduce memory consumption and you want to keep anything regarding periodic tasks in one single place in your app.

Here an example:
```ts
import Cron from '@winkgroup/cron'

const cron5 = new Cron(5) // every 5 seconds
const cron2 = new Cron(2) // every 2 seconds

async function unifiedPeriodicTasks() {
    await cron5.run( async () => {
        // anything you want to run every 5 seconds
    })
    await cron2.run( async () => {
        // anything you want to run every 2 seconds
    })
}

setInterval( unifiedPeriodicTasks, 1000)
```

even if your ```unifiedPeriodicTasks``` is called every second, your tasks will run with the period specified when you instanciated the Cron objects.

You can also manage cron setting when your task starts and stops, instead of using ```run``` method:
```ts
import Cron from '@winkgroup/cron'

const cron5 = new Cron(5)

setInterval(async () => {

    if (!cron5.tryStartRun()) return
    await myTask() // some very long task
    cron5.runCompleted()

}, 1000)

```
be aware the 5 seconds interval is calculated starting from ```runCompleted``` execution. This mean that if you have a task that takes 10 seconds to run and you set 5 seconds interval, the next task will run 15 seconds after the starting of the previous task. Another point to be aware of is that if you forget to call ```runCompleted``` **no other task will be called after the first one**, since ```Cron``` assumes the previous task is still running.

You can use ```Cron``` objects for debouncing, too. Here an example:
```ts
import Cron from '@winkgroup/cron'

const cron3 = new Cron(3)

setInterval(async () => {
    if (cron2.debounce()) {
        console.log('bouncing')
        return
    }

    console.log('task debounced')
}, 1000)

/*
Expected output:

task debounced
bouncing
bouncing
task debounced
bouncing
bouncing
...

/*
```

You can instantiate a ```Cron``` object with these params:
``` new Cron([everySeconds], [consoleLog]) ```
- *everySeconds*: cooldown between the end of a task and the start of the following one (default: 0)
- *consoleLog*: an instance of [ConsoleLog](https://github.com/WINKgroup/console-log) class

Here the list of attributes for ```Cron``` objects:
- *everySeconds*: cooldown between the end of a task and the start of the following one
- *lastRunAt*: epoch coming from Date().getTime(). You can use this to force a different cooldown
- consoleLog: an instance of [ConsoleLog](https://github.com/WINKgroup/console-log) class

Here the list methods for ```Cron``` objects:
- ```running() => boolean```: it says if a task is running
- ```nextRunIn() => number```: number of seconds you have to wait to run the next task
- ```debounce() => boolean```: if false you can run a debounced task according to cooldown period you set as *everySeconds* attribute. If true you have to wait. Every time you call this method the *lastRunAt* is updated at the current time
- ```run(task, [force]) => Promise<void>```: *task* is a function like this ```() => Promise<void>``` and it is called if the cooldown period is passed or you force the run with the second param
- ```tryStartRun([force]) => boolean```: if true you can start your periodic job. When true, ```Cron``` object consider you will start your task, so it expects you conclude your task by calling ```runCompleted```. If you don't call ```runCompleted``` any other call to ```tryStartRun([force])``` will return *false*, assuming your previous task is still running. Forcing ```tryStartRun``` will always return *true*
- ```runCompleted() => void```: used to notify ```Cron``` object you ended your task

There is also a static method:
- ```comeBackIn(milliseconds) => string```: it returns the ISOString of current time plus the number of milliseconds you set as parameter

## CronRunnerWithWebSocket
TO DO

## Development
in ```playground``` folder you will find a working implementation of **CronRunnerWithWebSocket**. You  can run it with ```npm run playground``` or ```yarn playground```


## Maintainers
* [fairsayan](https://github.com/fairsayan)