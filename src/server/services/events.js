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
  value: Joi.number().required(),
  period: Joi.string().valid(['AM', 'PM', 'DAY']),
});

const delEventGroupSchema = Joi.object().keys({
  groupId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'valid ObjectId')
    .required(),
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

const updateEventGroupSchema = Joi.object().keys({
  groupId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'valid ObjectId')
    .required(),
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

export const events = {
  load({ from, to, groupId } = {}) {
    const query = {};
    if (from) query.to = { $gte: from.toISOString() };
    if (to) query.from = { $lte: to.toISOString() };
    try {
      if (groupId) query.groupId = ObjectId(groupId);
      return Event.loadAll(query);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  delEventGroup({ groupId: id }) {
    try {
      const groupId = ObjectId(id);
      const deleteAll = () => Event.collection.remove({ groupId });
      const loadEventGroup = () => Event.loadAll({ groupId });
      return loadEventGroup().then(events => {
        return deleteAll().then(() => R.pluck('_id', events));
      });
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
    try {
      const { groupId: id, type, workerId: worker, status } = eventGroup;
      const groupId = ObjectId(id);
      const workerId = ObjectId(worker);
      const deleteAll = () => Event.collection.remove({ groupId });
      const loadEventGroup = () => Event.loadAll({ groupId });
      const loadAll = ids => Event.loadAll({ _id: { $in: ids } });
      const insertAll = (previousEvents, nextEventGroup) => {
        const { events } = nextEventGroup;
        const newEvents = R.map(
          e => ({ ...e, groupId, workerId, status, type }),
          events,
        );
        return Event.collection
          .insertMany(newEvents)
          .then(R.prop('insertedIds'));
      };
      return loadEventGroup().then(previousEvents => {
        return deleteAll()
          .then(() => insertAll(previousEvents, eventGroup))
          .then(loadAll);
      });
    } catch (err) {
      return Promise.reject(err);
    }
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
  evtx.use(SERVICE_NAME, events);
  evtx
    .service(SERVICE_NAME)
    .before({
      all: [checkUser()],
      load: [formatInput(inLoadMaker), validate(loadSchema)],
      addEventGroup: [formatInput(inAddMaker), validate(addEventGroupSchema)],
      updateEventGroup: [validate(updateEventGroupSchema)],
      delEventGroup: [validate(delEventGroupSchema)],
    })
    .after({
      load: [formatOutput(outMakerMany)],
      addEventGroup: [formatOutput(outMakerMany)],
    });

  loginfo('events service registered');
};

export default init;

/* eslint-disable no-shadow, no-param-reassign */
