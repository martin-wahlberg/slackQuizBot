import actions from './actions';
import boltApp from './bolt';
import { databaseRef } from './firebase';
//import cronJobs from './CronJobs';

actions();
//cronJobs();

const test = () => {
  databaseRef
    .child('pastWeeks')
    .orderByChild('weekLastUpdated')
    .once('value')
    .then(snapshot => console.log(Object.values(snapshot.val())));
};
test();

(async () => {
  await boltApp.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
