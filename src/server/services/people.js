/* eslint-disable no-param-reassign, no-shadow */

import debug from 'debug';
import moment from 'moment';
import uppercamelcase from 'uppercamelcase';
import R from 'ramda';
import { ObjectId } from 'mongobless';
import { Person, Preference, Note } from '../models';
import { emitEvent, formatOutput } from './utils';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'people';
const inMaker = (data) => {
  const attrs = ['_id', 'prefix', 'firstName', 'lastName', 'type', 'jobType', 'jobDescription', 'department', 'roles', 'email', 'birthdate'];
  const res = R.pick(attrs, data);
  if (data.companyId) res.companyId = ObjectId(data.companyId);
  if (res.type !== 'worker') res.roles = undefined;
  if (res.type === 'worker' && data.skills) {
    res.skills = R.compose(R.sortBy(R.identity), R.uniq, R.filter(R.identity), R.map(t => uppercamelcase(t)))(data.skills);
  }
  if (data.phones) {
    const pttrs = ['label', 'number'];
    res.phones = R.compose(R.filter(p => p.number), R.map(p => R.pick(pttrs, p)))(data.phones);
  }
  if (data.avatar) {
    const avttrs = ['src', 'url', 'color', 'type'];
    res.avatar = R.pick(avttrs, data.avatar);
  }
  if (data.tags) {
    res.tags = R.compose(R.sortBy(R.identity), R.uniq, R.filter(R.identity), R.map(t => uppercamelcase(t)))(data.tags);
  }
  if (data.roles) {
    res.roles = R.compose(R.sortBy(R.identity), R.uniq, R.filter(R.identity), R.map(t => uppercamelcase(t)))(data.roles);
  }
  return res;
};

export const people = {
  load() {
    return Person.loadAll().then(p => Preference.spread('person', this.user, p));
  },

  loadOne(id) {
    return Person
      .loadOne(id)
      .then(person => Preference.spread('person', this.user, [person]))
      .then(people => people[0]);
  },


  add(person) {
    const isPreferred = Boolean(person.preferred);
    const noteContent = person.note;
    const newPerson = inMaker(person);
    newPerson.createdAt = new Date();
    const insertOne = p => Person.collection.insertOne(p).then(R.prop('insertedId'));
    const loadOne = id => Person.loadOne(id);
    const updatePreference = p => Preference.update('person', this.user, isPreferred, p);
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
    const update = nextVersion => (previousVersion) => {
      nextVersion.updatedAt = new Date();
      return Person.collection.updateOne({ _id: previousVersion._id }, { $set: nextVersion }).then(() => ({ _id: previousVersion._id }));
    };
    const updatePreference = p => Preference.update('person', this.user, isPreferred, p);

    return loadOne(newVersion)
      .then(update(newVersion))
      .then(loadOne)
      .then(updatePreference)
      .then((updatedPerson) => {
        updatedPerson.preferred = isPreferred;
        return updatedPerson;
      });
  },

  updateTags({ _id, tags }) {
    const id = ObjectId(_id);
    const newTags = inMaker({ tags });
    const loadOne = id => Person.loadOne(id);
    const updateTags = (id, tags) => Person.collection.updateOne({ _id: id }, { $set: { tags } }).then(() => id);
    return updateTags(id, newTags).then(loadOne);
  },

  setPreferred({ _id, preferred }) {
    const loadOne = id => Person.loadOne(id);
    const updatePreference = person => Preference.update('person', this.user, preferred, person);

    return loadOne(_id)
      .then(updatePreference)
      .then((person) => {
        person.updatedAt = new Date();
        person.preferred = preferred;
        return person;
      });
  },

  del(id) {
    const deleteOne = () => Person.collection.updateOne({ _id: ObjectId(id) }, { $set: { updatedAt: new Date(), isDeleted: true } });
    const deletePreference = () => Preference.delete(this.user, id);
    const deleteNotes = () => Note.deleteForEntity(id);

    return deleteOne()
      .then(deletePreference)
      .then(deleteNotes)
      .then(id => ({ _id: id}));
  },

  checkEmailUniqueness(email) {
    const emailToCheck = email.trim();
    return Person.loadByEmail(emailToCheck, { _id: 1 })
      .then((person) => ({ email: emailToCheck, ok: !Boolean(person) }));
  },

};


const outMaker = (person) => {
  person.name = person.fullName();
  if (!person.updatedAt && moment.duration(moment() - person.createdAt).asHours() < 2) person.isNew = true;
  else if (person.updatedAt && moment.duration(moment() - person.updatedAt).asHours() < 1) person.isUpdated = true;
  return person;
};

export const outMakerMany = R.map(outMaker);

const init = (evtx) => {
  evtx.use(SERVICE_NAME, people);
  evtx.service(SERVICE_NAME)
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
