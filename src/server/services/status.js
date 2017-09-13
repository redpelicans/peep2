import debug from 'debug';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'status';
const status = {
  ping(data) {
    return Promise.resolve(data);
  },
};
const init = (evtx) => {
  evtx.use(SERVICE_NAME, status);
  evtx.service(SERVICE_NAME);
  loginfo('status service registered');
};

export default init;
