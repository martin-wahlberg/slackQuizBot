import actions from './actions';
import boltApp from './bolt';
import { PORT } from './constants/environment';
//import cronJobs from './CronJobs';

actions();
//cronJobs();

(async () => {
  await boltApp.start(PORT);
  console.log('⚡️ Bolt app is running!');
})();
