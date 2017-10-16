import R from 'ramda';
import initStatus from './status';

const allServices = [initStatus];

const init = evtx =>
  R.reduce((acc, service) => acc.configure(service), evtx, allServices);
export default init;
