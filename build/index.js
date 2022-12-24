"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var console_log_1 = __importDefault(require("@winkgroup/console-log"));
var Cron = /** @class */ (function () {
    function Cron(everySeconds, consoleLog) {
        if (everySeconds === void 0) { everySeconds = 0; }
        this.lastRunAt = 0;
        this.isRunning = false;
        this.everySeconds = everySeconds;
        this.consoleLog = consoleLog ? consoleLog : new console_log_1.default({ prefix: "Cron" });
    }
    Object.defineProperty(Cron.prototype, "running", {
        get: function () { return this.isRunning; },
        enumerable: false,
        configurable: true
    });
    Cron.prototype.tryStartRun = function (force) {
        var now = (new Date()).getTime();
        if (!force && (this.isRunning || (now - this.lastRunAt) / 1000 < this.everySeconds)) {
            if (this.consoleLog && this.isRunning)
                this.consoleLog.debug('cron still running: not starting again');
            return false;
        }
        if (this.consoleLog)
            this.consoleLog.debug('cron start running...');
        this.isRunning = true;
        return true;
    };
    Cron.prototype.runCompleted = function () {
        this.isRunning = false;
        if (this.consoleLog)
            this.consoleLog.debug('cron ended running');
        this.lastRunAt = (new Date()).getTime();
    };
    Cron.comeBackIn = function (milliseconds) {
        var epoch = (new Date()).getTime();
        epoch += milliseconds;
        return (new Date(epoch)).toISOString();
    };
    return Cron;
}());
exports.default = Cron;
