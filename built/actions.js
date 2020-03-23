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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bolt_1 = __importDefault(require("./bolt"));
const utils_1 = require("./utils");
const quizregistration_1 = __importDefault(require("./modals/quizregistration"));
const Messages_1 = require("./Messages");
const weekWithGraph_1 = __importStar(require("./modals/weekWithGraph"));
const performQuizAction = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload.user_name);
    //Registrert bruker actions
    if (yield utils_1.checkIfUserExists(payload.user_name)) {
        switch (true) {
            case !!payload.text.toLowerCase().match(/addUser/gi):
                utils_1.log('add_user');
                utils_1.addUser(payload.user_name, payload.text);
                return;
            case !!payload.text.toLowerCase().match(/quizTime/gi):
                utils_1.log('quiz_time');
                bolt_1.default.client.chat.postMessage(Messages_1.quizMessage(payload.text.replace(/quizTime/gi, '').trim()));
                return;
        }
    }
});
const performOverflowAction = (payload, triggerId) => {
    const { value } = payload.selected_option;
    switch (true) {
        case !!value.match(/bestWeek/gi):
            weekWithGraph_1.default(weekWithGraph_1.WeekTypes.BEST_WEEK).then(view => utils_1.openModal(triggerId, view));
            return;
        case !!value.match(/lastWeek/gi):
            weekWithGraph_1.default(weekWithGraph_1.WeekTypes.LAST_WEEK).then(view => utils_1.openModal(triggerId, view));
            return;
    }
};
const actions = () => {
    bolt_1.default.command('/quizbot', ({ ack, payload }) => {
        ack();
        performQuizAction(payload);
    });
    bolt_1.default.view('submit_score', (event) => __awaiter(void 0, void 0, void 0, function* () {
        const { ack, view } = event;
        ack();
        Messages_1.updateMessageWithStats(view.state.values, view.private_metadata);
        utils_1.log('submit_score');
    }));
    bolt_1.default.action('register_score', ({ ack, body }) => {
        ack();
        //@ts-ignore
        const triggerId = body.trigger_id;
        //@ts-ignore
        const messageTs = body.message.ts;
        utils_1.openModal(triggerId, quizregistration_1.default(messageTs));
    });
    bolt_1.default.action('quiz_stats', event => {
        const { ack, payload, body } = event;
        //@ts-ignore
        const triggerId = body.trigger_id;
        ack();
        performOverflowAction(payload, triggerId);
    });
};
exports.default = actions;
//# sourceMappingURL=actions.js.map