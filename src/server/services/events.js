/* eslint-disable no-shadow, no-param-reassign */

import debug from 'debug';
import { ObjectId } from 'mongobless';
import R from 'ramda';
import Yup from 'yup';
import { Event } from '../models';
import {
  ObjectIdSchemaType,
  validate,
  emitEvent,
  checkUser,
  formatInput,
  formatOutput,
} from './utils';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'events';

const loadSchema = Yup.object().shape({
  from: Yup.date(),
  to: Yup.date(),
  groupId: new ObjectIdSchemaType(),
});

const addEventSchema = Yup.object().shape({
  from: Yup.date().required(),
  to: Yup.date().required(),
  value: Yup.number().required(),
  period: Yup.string().oneOf(['AM', 'PM', 'DAY']),
});

const delEventGroupSchema = Yup.object().shape({
  groupId: new ObjectIdSchemaType().required(),
});

const addEventGroupSchema = Yup.object().shape({
  from: Yup.date().required(),
  to: Yup.date().required(),
  status: Yup.string()
    .oneOf(['TBV', 'V'])
    .required(),
  type: Yup.string()
    .oneOf(['vacation', 'sickLeaveDay'])
    .required(),
  workerId: new ObjectIdSchemaType().required(),
  events: Yup.array()
    .of(addEventSchema)
    .required(),
  description: Yup.string().nullable(),
});

const updateEventGroupSchema = Yup.object().shape({
  groupId: new ObjectIdSchemaType().required(),
  from: Yup.date().required(),
  to: Yup.date().required(),
  status: Yup.string()
    .oneOf(['TBV', 'V'])
    .required(),
  type: Yup.string()
    .oneOf(['vacation', 'sickLeaveDay'])
    .required(),
  workerId: new ObjectIdSchemaType().required(),
  events: Yup.array()
    .of(addEventSchema)
    .required(),
  description: Yup.string().nullable(),
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
        workerId,
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
    if (from) query.to = { $gte: from };
    if (to) query.from = { $lte: to };
    if (groupId) query.groupId = groupId;
    return Event.loadAll(query);
  },

  delEventGroup({ groupId }) {
    const deleteAll = () => Event.collection.remove({ groupId });
    const loadEventGroup = () => Event.loadAll({ groupId });
    return loadEventGroup().then(events =>
      deleteAll().then(() => R.pluck('_id', events)),
    );
  },

  addEventGroup(eventGroup) {
    const events = makeEventsFromGroup(eventGroup);
    const insertMany = events =>
      Event.collection.insertMany(events).then(R.prop('insertedIds'));
    const loadAll = ids => Event.loadAll({ _id: { $in: ids } });
    return insertMany(events).then(loadAll);
  },

  updateEventGroup(eventGroup) {
    const { groupId, type, workerId, status, description } = eventGroup;
    const deleteAll = () => Event.collection.remove({ groupId });
    const loadEventGroup = () => Event.loadAll({ groupId });
    const loadAll = ids => Event.loadAll({ _id: { $in: ids } });
    const insertAll = (previousEvents, nextEventGroup) => {
      const { events } = nextEventGroup;
      const newEvents = R.map(
        e => ({ ...e, groupId, workerId, status, type, description }),
        events,
      );
      return Event.collection.insertMany(newEvents).then(R.prop('insertedIds'));
    };
    return loadEventGroup().then(previousEvents => {
      return deleteAll()
        .then(() => insertAll(previousEvents, eventGroup))
        .then(loadAll)
        .then(nextEvents => ({ previousEvents, nextEvents }));
    });
  },
};

export const outMaker = event => event;
export const outMakerMany = R.map(outMaker);

const emitUpdateEvent = () => ctx => {
  const { output: { previousEvents = [], nextEvents = [] } } = ctx;
  const name = 'events:deleted';
  ctx.evtx.service('events').emit(name, {
    ...ctx,
    message: { replyTo: name },
    output: R.pluck('_id', previousEvents),
  });
  return Promise.resolve({ ...ctx, output: nextEvents });
};

const init = evtx => {
  evtx.use(SERVICE_NAME, events);
  evtx
    .service(SERVICE_NAME)
    .before({
      all: [checkUser()],
      load: [validate(loadSchema)],
      addEventGroup: [validate(addEventGroupSchema)],
      updateEventGroup: [validate(updateEventGroupSchema)],
      delEventGroup: [validate(delEventGroupSchema)],
    })
    .after({
      load: [formatOutput(outMakerMany)],
      addEventGroup: [formatOutput(outMakerMany), emitEvent('events:added')],
      updateEventGroup: [emitUpdateEvent(), emitEvent('events:added')],
      delEventGroup: [emitEvent('events:deleted')],
    });

  loginfo('events service registered');
};

export default init;

/* eslint-disable no-shadow, no-param-reassign */
