import debug from 'debug';
import R from 'ramda';
import Yup from 'yup';
import { ObjectId } from 'mongobless';
import { Note } from '../models';
import {
  checkUser,
  validate,
  ObjectIdSchemaType,
  emitEvent,
  formatOutput,
} from './utils';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'notes';

const addSchema = Yup.object().shape({
  content: Yup.string().required(),
  entityId: new ObjectIdSchemaType(),
  entityType: Yup.string()
    .nullable()
    .oneOf(['person', 'company', 'mission'])
    .required(),
  dueDate: Yup.date(),
  //assigneesIds: Yup.array.of(new ObjectIdSchemaType()),
});

const updateSchema = addSchema.concat(
  Yup.object().shape({
    _id: new ObjectIdSchemaType().required(),
  }),
);

const deleteSchema = Yup.object().shape({
  _id: new ObjectIdSchemaType().required(),
});

const outMaker = note => note;
export const outMakerMany = R.map(outMaker);

const inMaker = input => {
  return input;
};

export const notes = {
  load() {
    return Note.loadAll();
  },

  del({ _id }) {
    const deleteOne = () =>
      Note.collection.updateOne(
        { _id },
        { $set: { updatedAt: new Date(), isDeleted: true } },
      );
    return deleteOne().then(() => ({ _id }));
  },

  add(note) {
    const newNote = inMaker(note);
    newNote.authorId = this.user._id;
    newNote.createdAt = new Date();
    const loadOne = id => Note.loadOne(id);
    const insertOne = p =>
      Note.collection.insertOne(p).then(R.prop('insertedId'));
    return insertOne(newNote).then(loadOne);
  },

  update(note) {
    const newVersion = inMaker(note);
    newVersion.authorId = this.user._id;
    newVersion.updatedAt = new Date();
    const loadOne = ({ _id }) => Note.loadOne(_id);
    const update = nextVersion => previousVersion =>
      Note.collection
        .updateOne(
          { _id: previousVersion._id },
          { $set: { ...nextVersion, updatedAt: new Date() } },
        )
        .then(() => ({ _id: previousVersion._id }));

    return loadOne(newVersion)
      .then(update(newVersion))
      .then(loadOne);
  },
};

const init = evtx => {
  evtx.use(SERVICE_NAME, notes);
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
      loadOne: [formatOutput(outMaker)],
      add: [formatOutput(outMaker), emitEvent('note:added')],
      del: [emitEvent('note:deleted')],
      update: [formatOutput(outMaker), emitEvent('note:updated')],
    });

  loginfo('notes service registered');
};

export default init;
