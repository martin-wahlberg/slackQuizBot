import boltApp from './bolt';
import { SlashCommand, OverflowAction } from '@slack/bolt';
import { addUser, log, checkIfUserExists, openModal } from './utils';
import getQuizRegistrationModal from './modals/quizregistration';
import { quizMessage, updateMessageWithStats } from './Messages';
import getWeekWithGraphModal, { WeekTypes } from './modals/weekWithGraph';

const performQuizAction = async (payload: SlashCommand) => {
  console.log(payload.user_name);
  //Registrert bruker actions
  if (await checkIfUserExists(payload.user_name)) {
    switch (true) {
      case !!payload.text.toLowerCase().match(/addUser/gi):
        log('add_user');
        addUser(payload.user_name, payload.text);
        return;

      case !!payload.text.toLowerCase().match(/quizTime/gi):
        log('quiz_time');
        boltApp.client.chat.postMessage(
          quizMessage(payload.text.replace(/quizTime/gi, '').trim())
        );
        return;
    }
  }
};

const performOverflowAction = (payload: OverflowAction, triggerId: string) => {
  const { value } = payload.selected_option;
  switch (true) {
    case !!value.match(/bestWeek/gi):
      getWeekWithGraphModal(WeekTypes.BEST_WEEK).then((view) =>
        openModal(triggerId, view)
      );
      return;

    case !!value.match(/lastWeek/gi):
      getWeekWithGraphModal(WeekTypes.LAST_WEEK).then((view) =>
        openModal(triggerId, view)
      );
      return;

    case !!value.match(/worstWeek/gi):
      getWeekWithGraphModal(WeekTypes.WORST_WEEK).then((view) =>
        openModal(triggerId, view)
      );
      return;
  }
};

const actions = () => {
  boltApp.command('/quizbot', async ({ ack, payload }) => {
    ack();
    performQuizAction(payload);
  });

  boltApp.view('submit_score', async (event) => {
    const { ack, view } = event;
    ack();
    updateMessageWithStats(view.state.values, view.private_metadata);
    log('submit_score');
  });

  boltApp.action('register_score', async ({ ack, body }) => {
    ack();
    //@ts-ignore
    const triggerId = body.trigger_id;
    //@ts-ignore
    const messageTs: string = body.message.ts;
    openModal(triggerId, getQuizRegistrationModal(messageTs));
  });

  boltApp.action('quiz_stats', async (event) => {
    const { ack, payload, body } = event;
    //@ts-ignore
    const triggerId = body.trigger_id;
    ack();
    performOverflowAction(payload as OverflowAction, triggerId);
  });
};

export default actions;
