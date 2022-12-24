import ConsoleLog from "@winkgroup/console-log"

export default class Cron {
    everySeconds:number
    lastRunAt = 0
    private isRunning = false
    consoleLog:ConsoleLog

    constructor(everySeconds = 0, consoleLog?:ConsoleLog) {
        this.everySeconds = everySeconds
        this.consoleLog = consoleLog ? consoleLog : new ConsoleLog({ prefix: "Cron" })
    }

    get running() { return this.isRunning }

    tryStartRun(force?:boolean) {
        const now = (new Date()).getTime()
        if (!force && ( this.isRunning || (now - this.lastRunAt) / 1000 < this.everySeconds) ) {
            if (this.consoleLog && this.isRunning)
                this.consoleLog.debug('cron still running: not starting again')
            return false
        }
        if (this.consoleLog) this.consoleLog.debug('cron start running...')
        this.isRunning = true
        return true
    }

    runCompleted() {
        this.isRunning = false
        if (this.consoleLog) this.consoleLog.debug('cron ended running')
        this.lastRunAt = (new Date()).getTime()
    }

    static comeBackIn(milliseconds:number) {
        let epoch = (new Date()).getTime()
        epoch += milliseconds
        return (new Date(epoch)).toISOString()
    }
}