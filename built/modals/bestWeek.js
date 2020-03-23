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
const getBestWeekModal = () => __awaiter(void 0, void 0, void 0, function* () {
    const bestWeek = yield firebase_1.databaseRef
        .child('pastWeeks')
        .orderByChild('weekLastUpdated')
        .limitToLast(1)
        .once('value')
        .then(snapshot => console.log(Object.values(snapshot.val())));
    console.log(bestWeek);
    const modal = {
        type: 'modal',
        title: {
            type: 'plain_text',
            text: 'Beste uke',
            emoji: true
        },
        submit: {
            type: 'plain_text',
            text: 'Submit',
            emoji: true
        },
        close: {
            type: 'plain_text',
            text: 'Cancel',
            emoji: true
        },
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: 'This is a mrkdwn section block :ghost: *this is bold*, and ~this is crossed out~, and <https://google.com|this is a link>'
                }
            },
            {
                type: 'image',
                image_url: 'https://quickchart.io/chart?bkg=white&c=%7B%0A%20%20type%3A%20%27bar%27%2C%0A%20%20data%3A%20%7B%0A%20%20%20%20labels%3A%20%5B%22mandag%22%2C%20%22tirsdag%22%2C%20%22onsdag%22%2C%20%22torsdag%22%2C%20%22fredag%22%5D%2C%0A%20%20%20%20datasets%3A%20%5B%7B%0A%20%20%20%20%20%20label%3A%20%27Legitime%20poeng%27%2C%0A%20%20%20%20%20%20data%3A%20%5B6%2C%207%2C%205%2C%2010%2C%203%5D%0A%20%20%20%20%7D%2C%20%7B%0A%20%20%20%20%20%20label%3A%20%27Bonuspoeng%27%2C%0A%20%20%20%20%20%20data%3A%20%5B1%2C%200.5%2C%201%2C%200%2C%201%5D%0A%20%20%20%20%7D%5D%0A%20%20%7D%2C%0A%20%20%20%20options%3A%7B%0A%20%20%20%20title%3A%7B%0A%20%20%20%20display%3Atrue%2C%0A%20%20%20%20text%3A%27Uke%2013%27%2C%0A%20%20%20%20fontColor%3A%20%27hotpink%27%2C%0A%20%20%20%20fontSize%3A%2032%2C%0A%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D',
                alt_text: 'image1'
            }
        ]
    };
    return modal;
});
exports.default = getBestWeekModal;
//# sourceMappingURL=bestWeek.js.map