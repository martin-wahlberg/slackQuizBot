import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    //@ts-ignore
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    projectId: 'slackbots-84cf4',
    clientEmail:
      'firebase-adminsdk-6388z@slackbots-84cf4.iam.gserviceaccount.com'
  }),
  databaseURL: 'https://slackbots-84cf4.firebaseio.com'
});

export const databaseRef = admin
  .database()
  .ref()
  .child(`quizbot/${process.env.ENVIRONMENT || 'dev'}`);
