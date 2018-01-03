import debug from 'debug';
import evtX from 'evtx';
import initServices from '../services';
import initRestApi from '../restApi';

const loginfo = debug('peep:evtx');
const init = ctx => {
  const { io, config } = ctx;
  const api = evtX(config).configure(initServices);
  const status = evtX(config).configure(initRestApi);
  loginfo('EvtX setup.');
  return { ...ctx, api, status };
};

export default init;
