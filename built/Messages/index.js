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
const bolt_1 = __importDefault(require("../bolt"));
const utils_1 = require("../utils");
exports.quizMessage = (time) => {
    const text = time
        ? `Det er straks tid for quiz! :medal:\nQuizen starter ${time}\n<!channel>`
        : `Nå er det tid for quiz! :medal:\n<!channel>`;
    return {
        token: process.env.SLACK_BOT_TOKEN,
        channel: process.env.QUIZ_CHANNEL_ID || '',
        text,
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Registrer resultat',
                        emoji: true
                    },
                    action_id: 'register_score'
                }
            }
        ]
    };
};
exports.updateMessageWithStats = (input, ts) => __awaiter(void 0, void 0, void 0, function* () {
    const formState = input;
    let legitimatePoints = parseInt(formState.legitimate.legitimate.value);
    let bonusPoints = parseFloat(formState.bonus.bonus.value) || 0;
    legitimatePoints = legitimatePoints > 10 ? 10 : legitimatePoints;
    bonusPoints =
        legitimatePoints + bonusPoints > 10 ? 10 - legitimatePoints : bonusPoints;
    const updatedScores = yield utils_1.updateScores(legitimatePoints, bonusPoints);
    const [todayPoints, todayBonus, todayCombined, streak, weekPoints, weekBonus, days, weekBestDay] = [
        updatedScores.today.points,
        updatedScores.today.bonus,
        updatedScores.today.points + updatedScores.today.bonus,
        updatedScores.streak.numberOfDays > 2 && updatedScores.streak,
        Object.values(updatedScores.week.days).reduce((acc, cur) => acc + cur.points, 0),
        Object.values(updatedScores.week.days).reduce((acc, cur) => acc + cur.bonus, 0),
        Object.keys(updatedScores.week.days).length,
        (() => {
            const [day, dayData] = Object.entries(updatedScores.week.days).reduce((acc, cur) => {
                const [, accData] = acc;
                const [, curData] = cur;
                return curData.points + curData.bonus > accData.points + accData.bonus
                    ? cur
                    : acc;
            });
            return `Ukens beste dag er ${day} med ${dayData.points} poeng ${dayData.bonus ? `og ${dayData.bonus} bonuspoeng` : ''} :clap:`;
        })()
    ];
    const streakText = streak &&
        `!\nDette er dag ${streak.numberOfDays} med ${streak.points} poeng på rad ${(() => {
            let string = '';
            for (let i = 0; i < streak.numberOfDays; i++) {
                string = string + utils_1.getPointEmoji(streak.points);
            }
            return string;
        })()}`;
    const text = `I dag ble det totalt ${todayCombined} poeng${streak ? streakText : utils_1.getPointEmoji(todayPoints)}`;
    const blocks = [
        {
            type: 'context',
            elements: [
                {
                    type: 'mrkdwn',
                    text: `${todayPoints} poeng og ${todayBonus} bonuspoeng`
                }
            ]
        },
        {
            type: 'section',
            text: {
                type: 'plain_text',
                text,
                emoji: true
            }
        }
    ];
    if (days > 1) {
        blocks.push({
            type: 'section',
            text: {
                type: 'plain_text',
                emoji: true,
                text: weekBestDay +
                    `\nTotalt denne uken er det ${weekPoints} poeng og ${weekBonus} bonuspoeng med en gjennomittscore på ${Number((weekBonus + weekPoints) / days).toFixed(1)} poeng per quiz! :bow:`
            }
        });
        blocks.push({
            type: 'context',
            elements: [
                {
                    type: 'mrkdwn',
                    text: `(${weekPoints}+${weekBonus})/${days}`
                }
            ]
        });
    }
    bolt_1.default.client.chat.update({
        token: process.env.SLACK_BOT_TOKEN,
        channel: process.env.QUIZ_CHANNEL_ID || '',
        ts,
        text,
        blocks
    });
});
//# sourceMappingURL=index.js.map