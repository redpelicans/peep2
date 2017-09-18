import { propEq } from 'ramda';

export const isWorker = propEq('type', 'worker');

