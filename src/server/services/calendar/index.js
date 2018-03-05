import debug from 'debug';
import daysOff from './spare_days';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'calendar';

export const calendar = {
  load() {
    return Promise.resolve(daysOff);
  },
};

const init = evtx => {
  evtx.use(SERVICE_NAME, calendar).service(SERVICE_NAME);
  loginfo('calendar service registered');
};

export default init;
