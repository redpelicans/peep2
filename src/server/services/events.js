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
  description: Yup.string(),
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
  description: Yup.string(),
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
    const { groupId, type, workerId, status } = eventGroup;
    const deleteAll = () => Event.collection.remove({ groupId });
    const loadEventGroup = () => Event.loadAll({ groupId });
    const loadAll = ids => Event.loadAll({ _id: { $in: ids } });
    const insertAll = (previousEvents, nextEventGroup) => {
      const { events } = nextEventGroup;
      const newEvents = R.map(
        e => ({ ...e, groupId, workerId, status, type }),
        events,
      );
      return Event.collection.insertMany(newEvents).then(R.prop('insertedIds'));
    };
    return loadEventGroup().then(previousEvents => {
      return deleteAll()
        .then(() => insertAll(previousEvents, eventGroup))
        .then(loadAll);
    });
  },
};

export const outMaker = event => event;
export const outMakerMany = R.map(outMaker);

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
      addEventGroup: [formatOutput(outMakerMany)],
    });

  loginfo('events service registered');
};

export default init;

/* eslint-disable no-shadow, no-param-reassign */
