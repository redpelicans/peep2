/* eslint-disable no-param-reassign, no-shadow */

import debug from 'debug';
import Yup from 'yup';
import moment from 'moment';
import uppercamelcase from 'uppercamelcase';
import R from 'ramda';
import { ObjectId } from 'mongobless';
import { Person, Preference, Note } from '../models';
import {
  checkUser,
  emitEvent,
  formatOutput,
  ObjectIdSchemaType,
  validate,
} from './utils';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'people';

const phoneSchema = Yup.object().shape({
  label: Yup.string().required(),
  number: Yup.string().required(),
});

const addSchema = Yup.object().shape({
  prefix: Yup.string()
    .trim()
    .oneOf(['Mr', 'Mrs'])
    .required(),
  firstName: Yup.string()
    .trim()
    .required(),
  lastName: Yup.string()
    .trim()
    .required(),
  type: Yup.string()
    .oneOf(['client', 'worker', 'contact'])
    .required(),
  email: Yup.string()
    .email()
    .required(),
  jobType: Yup.string()
    .oneOf(['designer', 'developer', 'manager', 'sales'])
    .required(),
  companyId: new ObjectIdSchemaType().required(),
  phones: Yup.array().of(phoneSchema),
  tags: Yup.array().of(Yup.string()),
  skills: Yup.array().of(Yup.string()),
  roles: Yup.array().of(Yup.string()),
  avatar: Yup.object().shape({
    color: Yup.string().required(),
  }),
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
  const newPerson = { ...input };
  if (input.type !== 'worker') newPerson.roles = undefined;
  if (input.type === 'worker' && input.skills) {
    newPerson.skills = R.compose(
      R.sortBy(R.identity),
      R.uniq,
      R.filter(R.identity),
      R.map(t => uppercamelcase(t)),
    )(input.skills);
  }
  if (input.phones) {
    const pttrs = ['label', 'number'];
    newPerson.phones = R.compose(
      R.filter(p => p.number),
      R.map(p => R.pick(pttrs, p)),
    )(input.phones);
  }
  if (input.tags) {
    newPerson.tags = R.compose(
      R.sortBy(R.identity),
      R.uniq,
      R.filter(R.identity),
      R.map(t => uppercamelcase(t)),
      R.map(R.trim),
    )(input.tags);
  }
  if (input.roles) {
    newPerson.roles = R.compose(
      R.sortBy(R.identity),
      R.uniq,
      R.filter(R.identity),
      R.map(R.trim),
    )(input.roles);
  }
  return newPerson;
};

export const people = {
  load() {
    return Person.loadAll();
  },

  add(person) {
    console.dir(person, { depth: null });
    const noteContent = person.note;
    const newPerson = inMaker(person);
    newPerson.createdAt = new Date();
    const insertOne = p =>
      Person.collection.insertOne(p).then(R.prop('insertedId'));
    const loadOne = id => Person.loadOne(id);
    const updatePreference = p =>
      Preference.update('person', this.user, isPreferred, p);
    const createNote = p => Note.create(noteContent, this.user, p);

    return insertOne(newPerson)
      .then(loadOne)
      .then(createNote)
      .then(({ entity }) => entity);
  },

  update(person) {
    console.dir(person, { depth: null });
    const newVersion = inMaker(person);
    const loadOne = ({ _id }) => Person.loadOne(_id);
    const update = nextVersion => previousVersion => {
      nextVersion.updatedAt = new Date();
      return Person.collection
        .updateOne({ _id: previousVersion._id }, { $set: nextVersion })
        .then(() => ({ _id: previousVersion._id }));
    };

    return loadOne(newVersion)
      .then(update(newVersion))
      .then(loadOne);
  },

  del({ _id }) {
    const deleteOne = () =>
      Person.collection.updateOne(
        { _id },
        { $set: { updatedAt: new Date(), isDeleted: true } },
      );
    const deleteNotes = () => Note.deleteForEntity(_id);

    return deleteOne()
      .then(deleteNotes)
      .then(() => ({ _id }));
  },

  checkEmailUniqueness(email) {
    const emailToCheck = email.trim();
    return Person.loadByEmail(emailToCheck, { _id: 1 }).then(person => ({
      email: emailToCheck,
      ok: !person,
    }));
  },
};

const outMaker = person => {
  person.name = person.fullName();
  if (
    !person.updatedAt &&
    moment.duration(moment() - person.createdAt).asHours() < 2
  )
    person.isNew = true;
  else if (
    person.updatedAt &&
    moment.duration(moment() - person.updatedAt).asHours() < 1
  )
    person.isUpdated = true;
  return person;
};

export const outMakerMany = R.map(outMaker);

const init = evtx => {
  evtx.use(SERVICE_NAME, people);
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
      add: [formatOutput(outMaker), emitEvent('person:added')],
      update: [formatOutput(outMaker), emitEvent('person:updated')],
      del: [emitEvent('person:deleted')],
    });

  loginfo('people service registered');
};

export default init;

/* eslint-disable no-param-reassign, no-shadow */
