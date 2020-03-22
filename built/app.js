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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = __importDefault(require("./actions"));
const bolt_1 = __importDefault(require("./bolt"));
const firebase_1 = require("./firebase");
//import cronJobs from './CronJobs';
actions_1.default();
//cronJobs();
const test = () => {
    firebase_1.databaseRef
        .child('pastWeeks')
        .orderByChild('weekLastUpdated')
        .once('value')
        .then(snapshot => console.log(Object.values(snapshot.val())));
};
test();
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield bolt_1.default.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
}))();
//# sourceMappingURL=app.js.map