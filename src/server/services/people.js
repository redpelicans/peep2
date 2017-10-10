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

const avatarSchema = Yup.object().shape({
  color: Yup.string().required(),
});

const addSchema = Yup.object().shape({
  prefix: Yup.string()
    .oneOf(['Mr', 'Mrs'])
    .required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
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
  avatar: Yup.object().shape(avatarSchema),
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
    )(data.phones);
  }
  if (input.tags) {
    newPerson.tags = R.compose(
      R.sortBy(R.identity),
      R.uniq,
      R.filter(R.identity),
      R.map(t => uppercamelcase(t)),
    )(input.tags);
  }
  if (data.roles) {
    newPerson.roles = R.compose(
      R.sortBy(R.identity),
      R.uniq,
      R.filter(R.identity),
      R.map(t => uppercamelcase(t)),
    )(input.roles);
  }
  return newPerson;
};

export const people = {
  load() {
    return Person.loadAll().then(p =>
      Preference.spread('person', this.user, p),
    );
  },

  add(person) {
    const isPreferred = Boolean(person.preferred);
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
      .then(updatePreference)
      .then(createNote)
      .then(({ entity: addedPerson }) => {
        addedPerson.preferred = isPreferred;
        return addedPerson;
      });
  },

  update(person) {
    const isPreferred = Boolean(person.preferred);
    const newVersion = inMaker(person);
    newVersion._id = ObjectId(person._id);
    const loadOne = ({ _id: id }) => Person.loadOne(id);
    const update = nextVersion => previousVersion => {
      nextVersion.updatedAt = new Date();
      return Person.collection
        .updateOne({ _id: previousVersion._id }, { $set: nextVersion })
        .then(() => ({ _id: previousVersion._id }));
    };
    const updatePreference = p =>
      Preference.update('person', this.user, isPreferred, p);

    return loadOne(newVersion)
      .then(update(newVersion))
      .then(loadOne)
      .then(updatePreference)
      .then(updatedPerson => {
        updatedPerson.preferred = isPreferred;
        return updatedPerson;
      });
  },

  updateTags({ _id, tags }) {
    const id = ObjectId(_id);
    const newTags = inMaker({ tags });
    const loadOne = id => Person.loadOne(id);
    const updateTags = (id, tags) =>
      Person.collection
        .updateOne({ _id: id }, { $set: { tags } })
        .then(() => id);
    return updateTags(id, newTags).then(loadOne);
  },

  setPreferred({ _id, preferred }) {
    const loadOne = id => Person.loadOne(id);
    const updatePreference = person =>
      Preference.update('person', this.user, preferred, person);

    return loadOne(_id)
      .then(updatePreference)
      .then(person => {
        person.updatedAt = new Date();
        person.preferred = preferred;
        return person;
      });
  },

  del(id) {
    const deleteOne = () =>
      Person.collection.updateOne(
        { _id: ObjectId(id) },
        { $set: { updatedAt: new Date(), isDeleted: true } },
      );
    const deletePreference = () => Preference.delete(this.user, id);
    const deleteNotes = () => Note.deleteForEntity(id);

    return deleteOne()
      .then(deletePreference)
      .then(deleteNotes)
      .then(id => ({ _id: id }));
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
    })
    .after({
      load: [formatOutput(outMakerMany)],
      loadOne: [formatOutput(outMaker)],
      add: [formatOutput(outMaker), emitEvent('person:added')],
      del: [emitEvent('person:deleted')],
      update: [formatOutput(outMaker), emitEvent('person:updated')],
      updateTags: [formatOutput(outMaker), emitEvent('person:updated')],
    });

  loginfo('people service registered');
};

export default init;

/* eslint-disable no-param-reassign, no-shadow */
