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
  emitAddNoteEvent,
  formatOutput,
  ObjectIdSchemaType,
  validate,
} from './utils';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'missions';

const addSchema = Yup.object().shape({
  clientId: new ObjectIdSchemaType().required(),
  partnerId: new ObjectIdSchemaType(),
  managerId: new ObjectIdSchemaType().required(),
  name: Yup.string()
    .trim()
    .required(),
  startDate: Yup.date(),
  endDate: Yup.date(),
  billedTarget: Yup.string()
    .oneOf(['client', 'partner'])
    .required(),
  timesheetUnit: Yup.string()
    .oneOf(['day', 'hours'])
    .required(),
  allowWeekends: Yup.bool(),
  assigneesIds: Yup.array().of(new ObjectIdSchemaType()),
  note: Yup.string(),
});

const inMaker = input => {
  const newMission = R.omit(['note'], input);
  return newMission;
};

export const missions = {
  load() {
    return Mission.loadAll();
  },

  add(input) {
    const noteContent = input.note;
    const { locals: { user: author } } = this;
    const newMission = inMaker(input);
    newMission.createdAt = new Date();
    const insertOne = p =>
      Mission.collection.insertOne(p).then(R.prop('insertedId'));
    const loadOne = id => Mission.loadOne(id);
    const createNote = mission => Note.create(noteContent, author, mission);

    return insertOne(newMission)
      .then(loadOne)
      .then(createNote);
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
      add: [validate(addSchema)],
    })
    .after({
      load: [formatOutput(outMakerMany)],
      add: [
        emitAddNoteEvent(),
        formatOutput(outMaker),
        emitEvent('mission:added'),
      ],
    });

  loginfo('mission service registered');
};

export default init;

/* eslint-disable no-param-reassign, no-shadow */
