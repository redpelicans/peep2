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
  from: Joi.date().optional(),
  to: Joi.date().optional(),
  groupId: Joi.string().optional(),
});

const addEventSchema = Joi.object().keys({
  from: Joi.date().required(),
  to: Joi.date().required(),
  unit: Joi.string()
    .valid('day')
    .required(),
  value: Joi.number().required(),
  period: Joi.string().valid(['AM', 'PM']),
});

const addEventGroupSchema = Joi.object().keys({
  from: Joi.date().required(),
  to: Joi.date().required(),
  status: Joi.string()
    .valid(['TBV', 'V'])
    .required(),
  type: Joi.string()
    .valid(['vacation', 'sickLeaveDay'])
    .required(),
  workerId: Joi.string().required(),
  events: Joi.array()
    .items(addEventSchema)
    .required(),
  description: Joi.string(),
});

const makeEventsFromGroup = ({
  from,
  to,
  status,
  type,
  workerId,
  events,
  description,
}) => {
  const groupId = new ObjectId();
  return R.map(
    evt =>
      R.filter(R.complement(R.isNil), {
        groupId,
        from: evt.from,
        to: evt.to,
        status,
        type,
        workerId: ObjectId(workerId),
        description,
        unit: evt.unit,
        value: evt.value,
        period: evt.period,
      }),
    events,
  );
};

export const event = {
  load({ from, to, groupId }) {
    const query = {};
    if (from) query.to = { $gte: from.toISOString() };
    if (to) query.from = { $lte: to.toISOString() };
    try {
      // TODO check groupId with Joi
      if (groupId) query.groupId = ObjectId(groupId);
      return Event.loadAll(query);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  addEventGroup(eventGroup) {
    try {
      const events = makeEventsFromGroup(eventGroup);
      const insertMany = events =>
        Event.collection.insertMany(events).then(R.prop('insertedIds'));
      const loadAll = ids => Event.loadAll({ _id: { $in: ids } });
      return insertMany(events).then(loadAll);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  updateEventGroup(eventGroup) {
    console.log(eventGroup);
    return Promise.resolve([]);
  },
};

export const inLoadMaker = ({ from, to, ...props }) => ({
  ...props,
  from: from && new Date(from),
  to: to && new Date(to),
});

export const inAddMaker = ({ from, to, ...props }) => ({
  ...props,
  from: from && new Date(from),
  to: to && new Date(to),
});

export const outMaker = event => event;
export const outMakerMany = R.map(outMaker);

const init = evtx => {
  evtx.use(SERVICE_NAME, event);
  evtx
    .service(SERVICE_NAME)
    .before({
      all: [checkUser()],
      load: [formatInput(inLoadMaker), validate(loadSchema)],
      addEventGroup: [formatInput(inAddMaker), validate(addEventGroupSchema)],
    })
    .after({
      load: [formatOutput(outMakerMany)],
      addEventGroup: [formatOutput(outMakerMany)],
    });

  loginfo('events service registered');
};

export default init;

/* eslint-disable no-shadow, no-param-reassign */
