"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var runner_1 = __importDefault(require("./runner"));
var lodash_1 = __importDefault(require("lodash"));
var CronRunnerWithWebSocket = /** @class */ (function (_super) {
    __extends(CronRunnerWithWebSocket, _super);
    function CronRunnerWithWebSocket(everySeconds, ioNamespace, inputOptions) {
        var _this = this;
        var options = lodash_1.default.defaults(inputOptions, {});
        var prevStartActive = options.startActive;
        options.startActive = false;
        _this = _super.call(this, everySeconds, options) || this;
        _this.io = ioNamespace;
        _this.setIo();
        if (prevStartActive !== false)
            _this.start();
        return _this;
    }
    CronRunnerWithWebSocket.prototype.setIo = function () {
        var _this = this;
        this.io.use(function (socket, next) {
            var token = socket.handshake.auth.token;
            if (!_this.isTokenValid(token))
                next(new Error('access denied'));
            else
                next();
        });
        this.io.on('connection', function (socket) {
            _this.consoleLog.debug('client connected');
            socket.on('start', function () { return _this.start(); });
            socket.on('stop', function (force) { return _this.stop(force); });
            socket.on('run', function (force) { return _this.run(force); });
            socket.on('getState', function () { return socket.emit('state', _this.getState()); });
        });
    };
    CronRunnerWithWebSocket.prototype.isTokenValid = function (token) {
        return true;
    };
    CronRunnerWithWebSocket.prototype.run = function (force) {
        if (force === void 0) { force = false; }
        if (typeof force === 'undefined')
            force = this.forceRun;
        this.io.emit('running', { force: force });
        return _super.prototype.run.call(this, force);
    };
    CronRunnerWithWebSocket.prototype.start = function () {
        this.io.emit('starting');
        return _super.prototype.start.call(this);
    };
    CronRunnerWithWebSocket.prototype.stop = function (force) {
        if (force === void 0) { force = false; }
        this.io.emit('stopping', { force: force });
        return _super.prototype.stop.call(this);
    };
    return CronRunnerWithWebSocket;
}(runner_1.default));
exports.default = CronRunnerWithWebSocket;
