import CronRunner, { CronRunnerInput } from "./runner"
import { Namespace } from 'socket.io'
import _ from "lodash"

export interface CronRunnerWithSocketInput extends CronRunnerInput {
    ioNamespace: Namespace
}

export default abstract class CronRunnerWithWebSocket extends CronRunner {
    io:Namespace

    constructor(everySeconds:number, ioNamespace:Namespace, inputOptions?:Partial<CronRunnerInput>) {
        const options = _.defaults(inputOptions, {})

        const prevStartActive = options.startActive
        options.startActive = false
        super(everySeconds, options)
        this.io = ioNamespace
        this.setIo()
        if (prevStartActive !== false) this.start()
    }

    setIo() {
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token
            if (!this.isTokenValid(token)) next( new Error('access denied'))
                else next()
        })

        this.io.on('connection', (socket) => {
            this.consoleLog.debug('client connected')
            socket.on('start', () => this.start())
            socket.on('stop', (force?:boolean) => this.stop(force) )
            socket.on('run', (force?:boolean) => this.run(force) )
            socket.on('getState', () => socket.emit('state', this.getState()) )
        })
    }

    isTokenValid(token:string) {
        return true
    }

    run(force = false) {
        if (typeof force === 'undefined') force = this.forceRun
        this.io.emit('running', { force: force })
        return super.run(force)
    }

    start() {
        this.io.emit('starting')
        return super.start()
    }

    stop(force = false) {
        this.io.emit('stopping', { force: force })
        return super.stop()
    }
}