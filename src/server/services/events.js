/* eslint-disable no-shadow, no-param-reassign */

import debug from 'debug';
import R from 'ramda';
import { Event } from '../models';
import { checkUser, formatOutput } from './utils';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'events';

export const event = {
  load() {
    return Event.loadAll();
  },
};

export const outMaker = event => event;
export const outMakerMany = R.map(outMaker);

const init = evtx => {
  evtx.use(SERVICE_NAME, event);
  evtx
    .service(SERVICE_NAME)
    .before({ all: [checkUser()] })
    .after({
      load: [formatOutput(outMakerMany)],
    });

  loginfo('events service registered');
};

export default init;

/* eslint-disable no-shadow, no-param-reassign */
