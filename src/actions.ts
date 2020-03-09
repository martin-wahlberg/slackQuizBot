import boltApp from "./bolt";
import { SlashCommand } from "@slack/bolt";
import { addUser, log, checkIfUserExists, openModal } from "./utils";
import getQuizRegistrationModal from "./modals/quizregistration";
import { quizMessage, updateMessageWithStats } from "./Messages";

const performQuizAction = async (payload: SlashCommand) => {
  //Registrert bruker actions
  console.log(payload);
  if (await checkIfUserExists(payload.user_name)) {
    switch (true) {
      case !!payload.text.toLowerCase().match(/addUser/gi):
        log("add_user");
        addUser(payload.user_name, payload.text);
        return;

      case !!payload.text.toLowerCase().match(/quizTime/gi):
        log("quiz_time");
        boltApp.client.chat.postMessage(quizMessage);
        return;
    }
  }
};

const actions = () => {
  boltApp.command("/quizbot", ({ ack, payload }) => {
    ack();
    performQuizAction(payload);
  });

  boltApp.view("submit_score", async event => {
    const { ack, view } = event;
    ack();
    updateMessageWithStats(view.state.values, view.private_metadata);
    log("submit_score");
  });

  boltApp.action("register_score", ({ ack, body }) => {
    ack();
    //@ts-ignore
    const triggerId = body.trigger_id;
    //@ts-ignore
    const messageTs: string = body.message.ts;
    openModal(triggerId, getQuizRegistrationModal(messageTs));
  });
};

export default actions;
