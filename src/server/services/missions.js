/* eslint-disable no-param-reassign, no-shadow */

import debug from 'debug';
import Yup from 'yup';
import moment from 'moment';
import R from 'ramda';
import { ObjectId } from 'mongobless';
import { Mission, Note } from '../models';
import {
  checkUser,
  emitEvent,
  formatOutput,
  ObjectIdSchemaType,
  validate,
} from './utils';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'missions';

export const missions = {
  load() {
    return Mission.loadAll();
  },
};

const outMaker = mission => {
  return mission;
};

export const outMakerMany = R.map(outMaker);

const init = evtx => {
  evtx.use(SERVICE_NAME, missions);
  evtx
    .service(SERVICE_NAME)
    .before({
      all: [checkUser()],
    })
    .after({
      load: [formatOutput(outMakerMany)],
    });

  loginfo('mission service registered');
};

export default init;

/* eslint-disable no-param-reassign, no-shadow */
