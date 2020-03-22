import { View } from '@slack/web-api';

const getQuizRegistrationModal = (messageTs: string) => {
  const modal: View = {
    type: 'modal',
    callback_id: 'submit_score',
    private_metadata: messageTs,
    title: {
      type: 'plain_text',
      text: 'Quizregistrering',
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
        block_id: 'legitimate',
        type: 'input',
        element: {
          action_id: 'legitimate',
          type: 'plain_text_input',
          placeholder: {
            type: 'plain_text',
            text: '1-10'
          }
        },
        label: {
          type: 'plain_text',
          text: 'Antall legitime poeng:',
          emoji: true
        }
      },
      {
        type: 'input',
        optional: true,
        block_id: 'bonus',
        element: {
          action_id: 'bonus',
          type: 'plain_text_input'
        },
        label: {
          type: 'plain_text',
          text: 'Bonuspoeng:',
          emoji: true
        }
      }
    ]
  };
  return modal;
};

export default getQuizRegistrationModal;
