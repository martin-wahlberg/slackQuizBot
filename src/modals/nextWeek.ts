import { View } from '@slack/web-api';

const nextWeekModal: View = {
  type: 'modal',
  title: {
    type: 'plain_text',
    text: 'Neste uke',
    emoji: true,
  },
  close: {
    type: 'plain_text',
    text: 'Lukk',
    emoji: true,
  },
  blocks: [
    {
      type: 'image',
      image_url:
        'https://www.ajournalofmusicalthings.com/wp-content/uploads/2020/07/Picard-Facepalm.gif',
      alt_text: 'inspiration',
    },
  ],
};

export default nextWeekModal;
