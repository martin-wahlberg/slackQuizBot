import * as admin from 'firebase-admin';
import { ENVIRONMENT, FIREBASE_PRIVATE_KEY } from './constants/environment';

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: JSON.parse(FIREBASE_PRIVATE_KEY).replace(/\\n/g, '\n'),
    projectId: 'slackbots-84cf4',
    clientEmail:
      'firebase-adminsdk-6388z@slackbots-84cf4.iam.gserviceaccount.com',
  }),
  databaseURL: 'https://slackbots-84cf4.firebaseio.com',
});

export const databaseRef = admin
  .database()
  .ref()
  .child(`quizbot/${ENVIRONMENT}`);
