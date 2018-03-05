/* eslint-disable no-shadow, no-param-reassign */

import debug from 'debug';
import Yup from 'yup';
import uppercamelcase from 'uppercamelcase';
import R from 'ramda';
import { Company, Note } from '../models';
import {
  emitAddNoteEvent,
  emitNotesDeleted,
  validate,
  ObjectIdSchemaType,
  emitEvent,
  checkUser,
  formatOutput,
} from './utils';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'companies';

const deleteSchema = Yup.object().shape({
  _id: new ObjectIdSchemaType().required(),
});

const addSchema = Yup.object().shape({
  name: Yup.string().required(),
  type: Yup.string()
    .oneOf(['client', 'partner', 'tenant'])
    .required(),
  website: Yup.string(),
  address: Yup.object().shape({
    street: Yup.string(),
    zipcode: Yup.string(),
    city: Yup.string(),
    country: Yup.string(),
  }),
  avatar: Yup.object().shape({
    color: Yup.string().required(),
  }),
  tags: Yup.array().of(Yup.string()),
  note: Yup.string(),
});

const updateSchema = addSchema.concat(
  Yup.object().shape({
    _id: new ObjectIdSchemaType().required(),
  }),
);

export const inMaker = (author, input) => {
  const newCompany = R.omit(['note'], input);
  if (input.tags) {
    newCompany.tags = R.compose(
      R.sortBy(R.identity),
      R.uniq,
      R.filter(R.identity),
      R.map(t => uppercamelcase(t)),
    )(input.tags);
  }
  newCompany.authorId = author._id;
  return newCompany;
};

export const company = {
  load() {
    return Company.loadAll();
  },

  loadOne(id) {
    return Company.loadOne(id);
  },

  update(input) {
    const { locals: { user: author } } = this;
    const newVersion = inMaker(author, input);
    const loadOne = ({ _id }) => Company.loadOne(_id);
    const update = nextVersion => previousVersion => {
      nextVersion.updatedAt = new Date();
      return Company.collection
        .updateOne({ _id: previousVersion._id }, { $set: nextVersion })
        .then(() => ({ _id: previousVersion._id }));
    };
    return loadOne(newVersion)
      .then(update(newVersion))
      .then(loadOne);
  },

  add(input) {
    const noteContent = input.note;
    const { locals: { user: author } } = this;
    const newCompany = inMaker(author, input);
    newCompany.createdAt = new Date();
    const insertOne = company =>
      Company.collection.insertOne(company).then(R.prop('insertedId'));
    const loadOne = id => Company.loadOne(id);
    const createNote = company => Note.create(noteContent, author, company);

    return insertOne(newCompany)
      .then(loadOne)
      .then(createNote);
  },

  del({ _id }) {
    const { locals: { user: author } } = this;
    const deleteOne = () =>
      Company.collection.updateOne(
        { _id },
        { $set: { updatedAt: new Date(), isDeleted: true } },
      );
    const deleteNotes = () => Note.deleteForEntity(_id);

    return deleteOne()
      .then(deleteNotes)
      .then(() => ({ _id, authorId: author._id }));
  },
};

export const outMaker = company => {
  if (!company) return;
  company.createdAt = company.createdAt || new Date(1967, 9, 1);
  return company;
};

export const outMakerMany = R.map(outMaker);

const init = evtx => {
  evtx.use(SERVICE_NAME, company);
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
      add: [
        emitAddNoteEvent(),
        formatOutput(outMaker),
        emitEvent('company:added'),
      ],
      del: [emitEvent('company:deleted'), emitNotesDeleted()],
      update: [formatOutput(outMaker), emitEvent('company:updated')],
    });

  loginfo('companies service registered');
};

export default init;

/* eslint-disable no-shadow, no-param-reassign */
