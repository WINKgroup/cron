import CronRunner, { CronRunnerInput } from "./runner"
import { Namespace, Server as IOServer } from 'socket.io'
import _ from "lodash"

export interface CronRunnerWithSocketInput extends CronRunnerInput {
    ioNamespace: string
}

export default abstract class CronRunnerWithWebSocket extends CronRunner {
    io:Namespace

    constructor(everySeconds:number, ioServer:IOServer, inputOptions?:Partial<CronRunnerInput>) {
        const options = _.defaults(inputOptions, {
            ioNamespace: '/cron-runner'
        })
        const prevStartActive = options.startActive
        options.startActive = false
        super(everySeconds, options)
        this.io = ioServer.of(options.ioNamespace)
        this.setIo(ioServer, options.ioNamespace)
        if (prevStartActive) this.start()
    }

    setIo(ioServer:IOServer, namespace = '/cron-runner') {
        this.io = ioServer.of(namespace)

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