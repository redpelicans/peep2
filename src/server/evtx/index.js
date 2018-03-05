import debug from 'debug';
import evtX from 'evtx';
import initServices from '../services';
import initRestApi from '../restApi';

const loginfo = debug('peep:evtx');
const init = ctx => {
  const { config } = ctx;
  const evtx = evtX(config).configure(initServices);
  const restApi = evtX(config).configure(initRestApi);
  loginfo('EvtX setup.');
  return { ...ctx, evtx, restApi };
};

export default init;
