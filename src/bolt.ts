import { App } from '@slack/bolt';
import { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } from './constants/environment';

const boltApp = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
});

export default boltApp;
