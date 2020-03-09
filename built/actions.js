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
const bolt_1 = __importDefault(require("./bolt"));
const utils_1 = require("./utils");
const quizregistration_1 = __importDefault(require("./modals/quizregistration"));
const Messages_1 = require("./Messages");
const performQuizAction = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //Registrert bruker actions
    console.log(payload);
    console.log(yield utils_1.checkIfUserExists(payload.user_name));
    if (yield utils_1.checkIfUserExists(payload.user_name)) {
        switch (true) {
            case !!payload.text.toLowerCase().match(/addUser/gi):
                utils_1.log("add_user");
                console.log("inne");
                utils_1.addUser(payload.user_name, payload.text);
                return;
            case !!payload.text.toLowerCase().match(/quizTime/gi):
                utils_1.log("quiz_time");
                bolt_1.default.client.chat.postMessage(Messages_1.quizMessage);
                return;
        }
    }
});
const actions = () => {
    bolt_1.default.command("/quizbot", ({ ack, payload }) => {
        ack();
        performQuizAction(payload);
    });
    bolt_1.default.view("submit_score", (event) => __awaiter(void 0, void 0, void 0, function* () {
        const { ack, view } = event;
        ack();
        Messages_1.updateMessageWithStats(view.state.values, view.private_metadata);
        utils_1.log("submit_score");
    }));
    bolt_1.default.action("register_score", ({ ack, body }) => {
        ack();
        //@ts-ignore
        const triggerId = body.trigger_id;
        //@ts-ignore
        const messageTs = body.message.ts;
        utils_1.openModal(triggerId, quizregistration_1.default(messageTs));
    });
};
exports.default = actions;
//# sourceMappingURL=actions.js.map