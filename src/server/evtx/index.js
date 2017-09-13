import debug from 'debug';
import evtX from '../lib/evtx';
import initServices from '../services';
import initReactor from './reactor';

const loginfo = debug('peep:evtx');
const logerror = debug('peep:Error');
const init = (ctx) => {
  const { io, config } = ctx;
  const evtx = evtX(config).configure(initServices);
  return initReactor(evtx, io).then(() => {
    loginfo('EvtX setup.');
    return { ...ctx, evtx };
  });
};


export default init;
