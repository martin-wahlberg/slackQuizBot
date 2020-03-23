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
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../firebase");
const utils_1 = require("../utils");
var WeekTypes;
(function (WeekTypes) {
    WeekTypes["BEST_WEEK"] = "bestWeek";
    WeekTypes["LAST_WEEK"] = "lastWeek";
    WeekTypes["WORST_WEEK"] = "worstWeek";
})(WeekTypes = exports.WeekTypes || (exports.WeekTypes = {}));
const getWeek = (weekType) => {
    const pastWeeks = firebase_1.databaseRef.child('pastWeeks');
    switch (true) {
        case weekType == WeekTypes.BEST_WEEK:
            return pastWeeks
                .orderByChild('totalPoints')
                .limitToLast(1)
                .once('value')
                .then(snapshot => snapshot.val());
        case weekType == WeekTypes.LAST_WEEK:
            return pastWeeks
                .orderByChild('weekNumber')
                .limitToLast(1)
                .once('value')
                .then(snapshot => snapshot.val());
        case weekType == WeekTypes.WORST_WEEK:
            return pastWeeks
                .orderByChild('totalPoints')
                .limitToFirst(1)
                .once('value')
                .then(snapshot => snapshot.val());
        default:
            return pastWeeks
                .orderByChild('weekNumber')
                .once('value')
                .then(snapshot => snapshot.val());
    }
};
const getWeekText = (weekType, weekContent) => {
    switch (true) {
        case weekType === WeekTypes.BEST_WEEK:
            return `Uke ${weekContent.weekNumber} er den beste uken noen gang. Den uken fikk vi totalt ${weekContent.totalCombined} poeng hvorav ${weekContent.totalPoints} var legitime poeng og ${weekContent.totalBonus} var bonuspoeng :clap:`;
        case weekType === WeekTypes.WORST_WEEK:
            return `Uke ${weekContent.weekNumber} er den værste uken noen gang. Den uken fikk vi totalt ${weekContent.totalCombined} poeng hvorav ${weekContent.totalPoints} var legitime poeng og ${weekContent.totalBonus} var bonuspoeng :shit:`;
        case weekType === WeekTypes.LAST_WEEK:
            return `Forrige uke ble det totalt ${weekContent.totalCombined} poeng hvorav ${weekContent.totalPoints} var legitime poeng og ${weekContent.totalBonus} var bonuspoeng :clap:`;
        default:
            return 'Nå skjedde det no feil her...';
    }
};
const getWeekTitle = (weekType) => {
    switch (true) {
        case weekType === WeekTypes.BEST_WEEK:
            return 'Beste uke';
        case weekType === WeekTypes.WORST_WEEK:
            return 'Værste uke';
        case weekType === WeekTypes.LAST_WEEK:
            return 'Forrige uke';
        default:
            return ':thinking_face:';
    }
};
const getWeekWithGraphModal = (weekType) => __awaiter(void 0, void 0, void 0, function* () {
    const week = getWeek(weekType);
    const weekData = yield week;
    const weekContent = weekData && Object.values(weekData)[0];
    const weekDays = weekContent &&
        Object.entries(weekContent.days)
            .map(cur => ({
            day: cur[0],
            points: cur[1].points,
            bonus: cur[1].bonus
        }))
            .sort((a, b) => utils_1.getWeekDayNumber(a.day) - utils_1.getWeekDayNumber(b.day));
    const chartImageUrl = weekDays &&
        utils_1.getChartImageUrl({
            type: 'bar',
            data: {
                labels: weekDays.map(cur => cur.day),
                datasets: [
                    {
                        label: 'Legitime poeng',
                        data: weekDays.map(cur => cur.points)
                    },
                    {
                        label: 'Bonuspoeng',
                        data: weekDays.map(cur => cur.bonus)
                    }
                ]
            }
        });
    const blocks = weekContent
        ? [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: getWeekText(weekType, weekContent)
                }
            },
            {
                type: 'image',
                image_url: (chartImageUrl && encodeURI(chartImageUrl)) ||
                    'https://source.unsplash.com/1600x900/?kitten',
                alt_text: 'chart'
            }
        ]
        : [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `Fikk ikke hentet uke :slightly_frowning_face:`
                }
            }
        ];
    const modal = {
        type: 'modal',
        title: {
            type: 'plain_text',
            text: getWeekTitle(weekType),
            emoji: true
        },
        close: {
            type: 'plain_text',
            text: 'Lukk',
            emoji: true
        },
        blocks
    };
    return modal;
});
exports.default = getWeekWithGraphModal;
//# sourceMappingURL=weekWithGraph.js.map