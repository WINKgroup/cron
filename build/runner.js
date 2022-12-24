"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var console_log_1 = __importDefault(require("@winkgroup/console-log"));
var lodash_1 = __importDefault(require("lodash"));
var _1 = __importDefault(require("."));
var CronRunner = /** @class */ (function () {
    function CronRunner(everySeconds, inputOptions) {
        this._setup = false;
        var options = lodash_1.default.defaults(inputOptions, {
            startActive: true,
            forceRun: false
        });
        this._active = options.startActive;
        this.forceRun = options.forceRun;
        this.consoleLog = options.consoleLog ? options.consoleLog : new console_log_1.default({ prefix: 'CronRunner' });
        this.cron = new _1.default(everySeconds, this.consoleLog);
        if (this._active)
            this.start();
    }
    Object.defineProperty(CronRunner.prototype, "active", {
        get: function () { return this._active; },
        enumerable: false,
        configurable: true
    });
    CronRunner.prototype.run = function (force) {
        if (force === void 0) { force = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof force === 'undefined')
                            force = this.forceRun;
                        if (!this.cron.tryStartRun(force))
                            return [2 /*return*/];
                        return [4 /*yield*/, this._run()];
                    case 1:
                        _a.sent();
                        this.cron.runCompleted();
                        return [2 /*return*/];
                }
            });
        });
    };
    CronRunner.prototype.setup = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._setup = true;
                return [2 /*return*/];
            });
        });
    };
    CronRunner.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._setup) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.setup()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this._interval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, this.run()];
                        }); }); }, this.cron.everySeconds * 1000);
                        this._active = true;
                        this.consoleLog.debug('cron activated');
                        this.run();
                        return [2 /*return*/];
                }
            });
        });
    };
    CronRunner.prototype.stop = function (force) {
        if (force === void 0) { force = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                clearInterval(this._interval);
                this._interval = undefined;
                this._active = false;
                this.consoleLog.debug('cron deactivated');
                return [2 /*return*/];
            });
        });
    };
    CronRunner.prototype.getState = function () {
        var state = {
            active: this._active,
            running: this.cron.running,
            everySeconds: this.cron.everySeconds,
            lastRunAt: this.cron.lastRunAt
        };
        return state;
    };
    return CronRunner;
}());
exports.default = CronRunner;
