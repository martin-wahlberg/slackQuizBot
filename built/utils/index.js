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
const db_1 = require("./db");
const bolt_1 = __importDefault(require("../bolt"));
const moment = require("moment");
exports.addUser = (addedBy, userName) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db_1.getFromDb('users');
    db_1.writeToDb('users', [
        ...(users || []),
        { userName: userName.replace(/addUser/gi, '').trim(), addedBy }
    ]);
});
exports.checkIfUserExists = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db_1.getFromDb('users');
    return ((!!(users === null || users === void 0 ? void 0 : users.length) &&
        process.env.SUPER_ADMIN &&
        !!userName.includes(process.env.SUPER_ADMIN)) ||
        !!(users === null || users === void 0 ? void 0 : users.find(cur => cur.userName.includes(userName))));
});
let logging = false;
exports.log = (key) => __awaiter(void 0, void 0, void 0, function* () {
    if (logging) {
        setTimeout(() => {
            exports.log(key);
        }, 100);
    }
    else {
        logging = true;
        const analytics = yield db_1.getFromDb('log');
        const keyCount = analytics && analytics[key] ? analytics[key] + 1 : 1;
        db_1.writeToDb('log', Object.assign(Object.assign({}, analytics), { [key]: keyCount })).finally(() => {
            logging = false;
        });
    }
});
exports.openModal = (trigger_id, view) => {
    try {
        bolt_1.default.client.views
            .open({
            token: process.env.SLACK_BOT_TOKEN,
            // Pass a valid trigger_id within 3 seconds of receiving it
            trigger_id: trigger_id,
            // View payload
            view
        })
            .catch(err => {
            console.log('Open modal error', err);
        });
    }
    catch (error) {
        console.log('Open modal error', error);
    }
};
const getDay = (dayNumber) => {
    switch (dayNumber) {
        case 0:
            return 'søndag';
        case 1:
            return 'mandag';
        case 2:
            return 'tirsdag';
        case 3:
            return 'onsdag';
        case 4:
            return 'torsdag';
        case 5:
            return 'fredag';
        case 6:
            return 'lørdag';
        case 7:
            return 'søndag';
        default:
            return 'never';
    }
};
const makeWeekDayObject = (points, bonus, day) => ({
    [day ? day : getDay(moment().day())]: { points, bonus }
});
const updateWeek = (newDay, week) => {
    const weekNumber = moment().week();
    const isNotCurrentWeek = (week === null || week === void 0 ? void 0 : week.weekNumber) !== weekNumber;
    const thisWeek = Object.assign(Object.assign({}, week), { days: Object.assign(Object.assign({}, week === null || week === void 0 ? void 0 : week.days), newDay), weekNumber: (weekNumber === (week === null || week === void 0 ? void 0 : week.weekNumber) && week.weekNumber) || weekNumber, weekLastUpdated: moment().valueOf() });
    if (isNotCurrentWeek) {
        db_1.pushToDb('pastWeeks', week);
    }
    db_1.writeToDb('currentWeek', thisWeek);
    return thisWeek;
};
const updateStreak = (todaysPoints, streak) => {
    const onStreak = (streak === null || streak === void 0 ? void 0 : streak.points) === todaysPoints;
    const currentNumberOfDays = (streak === null || streak === void 0 ? void 0 : streak.numberOfDays) || 0;
    const thisStreak = {
        points: todaysPoints,
        numberOfDays: onStreak ? currentNumberOfDays + 1 : 1
    };
    db_1.writeToDb('streak', thisStreak);
    return thisStreak;
};
exports.updateScores = (points, bonus) => __awaiter(void 0, void 0, void 0, function* () {
    const [currentWeek, currentStreak] = yield Promise.all([
        db_1.getFromDb('currentWeek'),
        db_1.getFromDb('streak')
    ]);
    const week = updateWeek(makeWeekDayObject(points, bonus), currentWeek);
    const streak = updateStreak(points, currentStreak);
    const today = { points, bonus };
    return { week, streak, today };
});
exports.getPointEmoji = (points) => {
    switch (points) {
        case 1:
            return ':shit:';
        case 2:
            return ':face_palm:';
        case 3:
            return ':shrug:';
        case 4:
            return ':partly_sunny_rain:';
        case 5:
            return ':woman-tipping-hand:';
        case 6:
            return ':muscle:';
        case 7:
            return ':star:';
        case 8:
            return ':star-struck:';
        case 9:
            return ':tada:';
        case 10:
            return ':fire:';
        default:
            return ':shrug:';
            break;
    }
};
//# sourceMappingURL=index.js.map