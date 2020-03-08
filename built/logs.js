"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_loggly_bulk_1 = require("winston-loggly-bulk");
exports.initLogger = () => {
    winston_1.default.add(new winston_loggly_bulk_1.Loggly({
        token: '9c5f5918-6055-4f4f-b090-34a35af3aea0',
        subdomain: 'martinwahlberg',
        tags: ['QuizBot', process.env.ENVIRONMENT || 'DEV'],
        json: true
    }));
    winston_1.default.log('info', 'App restarted');
};
exports.remoteLogError = (type, error) => {
    winston_1.default.log('error', type, error);
};
//# sourceMappingURL=logs.js.map