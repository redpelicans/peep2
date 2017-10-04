/* eslint-disable no-shadow, no-param-reassign */

import debug from 'debug';
import { ObjectId } from 'mongobless';
import R from 'ramda';
import Joi from 'joi';
import { Event } from '../models';
import {
  validate,
  emitEvent,
  checkUser,
  formatInput,
  formatOutput,
} from './utils';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'events';

const loadSchema = Joi.object().keys({
  from: Joi.date(),
  to: Joi.date(),
  groupId: Joi.string(),
});

const addSchema = Joi.object().keys({
  from: Joi.date(),
  to: Joi.date(),
  groupId: Joi.string(),
});

export const event = {
  load({ from, to, groupId }) {
    const query = {};
    if (from) query.to = { $gte: from };
    if (to) query.from = { $lte: to };
    if (groupId) query.groupId = groupId;
    return Event.loadAll(query);
  },
  add(eventGroup) {},
};

export const inLoadMaker = ({ from, to, ...props }) => ({
  ...props,
  from: from && new Date(from),
  to: to && new Date(to),
});

export const inAddMaker = eventGroup => ({});

export const outMaker = event => event;
export const outMakerMany = R.map(outMaker);

const init = evtx => {
  evtx.use(SERVICE_NAME, event);
  evtx
    .service(SERVICE_NAME)
    .before({
      all: [checkUser()],
      load: [formatInput(inLoadMaker), validate(loadSchema)],
      add: [formatInput(inAddMaker), validate(addSchema)],
    })
    .after({
      load: [formatOutput(outMakerMany)],
    });

  loginfo('events service registered');
};

export default init;

/* eslint-disable no-shadow, no-param-reassign */
