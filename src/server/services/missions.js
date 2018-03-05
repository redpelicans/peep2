/* eslint-disable no-param-reassign, no-shadow */

import debug from 'debug';
import Yup from 'yup';
import R from 'ramda';
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
  billedTarget: Yup.string()
    .oneOf(['client', 'partner'])
    .required(),
  allowWeekends: Yup.bool(),
  note: Yup.string(),
});

const updateSchema = addSchema.concat(
  Yup.object().shape({
    _id: new ObjectIdSchemaType().required(),
  }),
);

const deleteSchema = Yup.object().shape({
  _id: new ObjectIdSchemaType().required(),
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

  update(mission) {
    const newVersion = inMaker(mission);
    newVersion.updatedAt = new Date();
    const loadOne = ({ _id }) => Mission.loadOne(_id);
    const update = nextVersion => previousVersion =>
      Mission.collection
        .updateOne(
          { _id: previousVersion._id },
          { $set: { ...nextVersion, updatedAt: new Date() } },
        )
        .then(() => ({ _id: previousVersion._id }));

    return loadOne(newVersion)
      .then(update(newVersion))
      .then(loadOne);
  },

  del({ _id }) {
    const deleteOne = () =>
      Mission.collection.updateOne(
        { _id },
        { $set: { updatedAt: new Date(), isDeleted: true } },
      );
    return deleteOne().then(() => ({ _id }));
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
      update: [validate(updateSchema)],
      del: [validate(deleteSchema)],
    })
    .after({
      load: [formatOutput(outMakerMany)],
      add: [
        emitAddNoteEvent(),
        formatOutput(outMaker),
        emitEvent('mission:added'),
      ],
      update: [formatOutput(outMaker), emitEvent('mission:updated')],
      del: [emitEvent('note:deleted')],
    });

  loginfo('mission service registered');
};

export default init;

/* eslint-disable no-param-reassign, no-shadow */
