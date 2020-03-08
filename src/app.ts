import actions from './actions';
import boltApp from './bolt';
//import cronJobs from './CronJobs';
import { initLogger } from './logs';

initLogger();
actions();
//cronJobs();

(async () => {
  await boltApp.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
