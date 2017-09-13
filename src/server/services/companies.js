/* eslint-disable no-shadow, no-param-reassign */

import debug from 'debug';
import { ObjectId } from 'mongobless';
import moment from 'moment';
import uppercamelcase from 'uppercamelcase';
import R from 'ramda';
import { Company, Preference, Note } from '../models';
import { emitEvent, checkUser, formatOutput } from './utils';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'companies';
export const inMaker = (company) => {
  const attrs = ['name', 'type', 'preferred', 'website'];
  const newCompany = R.pick(attrs, company);
  if (company.address) {
    const attrs = ['street', 'zipcode', 'city', 'country'];
    newCompany.address = R.pick(attrs, company.address);
  }

  if (company.avatar) {
    const attrs = ['src', 'url', 'color', 'type'];
    newCompany.avatar = R.pick(attrs, company.avatar);
  }

  if (company.tags) {
    newCompany.tags = R.compose(R.sortBy(R.identity), R.uniq, R.filter(R.identity), R.map(t => uppercamelcase(t)))(company.tags);
  }

  if (newCompany.type) newCompany.type = newCompany.type.toLowerCase();

  return newCompany;
};

export const emitNoteEvent = name => ctx => {
  // Do we have to remove prop note ?
 
  const { output: { note } } = ctx;
  if (note) {
    ctx.evtx.service('notes').emit(name, { ...ctx, message: { broadcastAll: true, replyTo: name }, output: note });
  }
  return Promise.resolve(ctx);
};

export const company = {
  load() {
    return Company.loadAll().then(companies => Preference.spread('company', this.user, companies));
  },

  loadOne(id) {
    return Company
      .loadOne(id)
      .then(company => Preference.spread('company', this.user, [company]))
      .then(companies => companies[0]);
  },

  setPreferred({ _id, preferred }) {
    const loadOne = id => Company.loadOne(id);
    const updatePreference = company => Preference.update('company', this.user, preferred, company);

    return loadOne(ObjectId(_id))
      .then(updatePreference)
      .then((company) => {
        company.preferred = preferred;
        return company;
      });
  },

  update(company) {
    const isPreferred = Boolean(company.preferred);
    const newVersion = inMaker(company);
    newVersion._id = ObjectId(company._id);
    const loadOne = ({ _id: id }) => Company.loadOne(id);
    const update = nextVersion => (previousVersion) => {
      nextVersion.updatedAt = new Date();
      return Company.collection.updateOne({ _id: previousVersion._id }, { $set: nextVersion }).then(() => ({ _id: previousVersion._id }));
    };
    const updatePreference = company => Preference.update('company', this.user, isPreferred, company);

    return loadOne(newVersion)
      .then(update(newVersion))
      .then(loadOne)
      .then(updatePreference)
      .then((company) => {
        company.preferred = isPreferred;
        return company;
      });
  },

  add(company) {
    const isPreferred = Boolean(company.preferred);
    const noteContent = company.note;
    const newCompany = inMaker(company);
    newCompany.createdAt = new Date();
    const insertOne = company => Company.collection.insertOne(company).then(R.prop('insertedId'));
    const loadOne = id => Company.loadOne(id);
    const updatePreference = company => Preference.update('company', this.user, isPreferred, company);
    const createNote = company => Note.create(noteContent, this.user, company);

    return insertOne(newCompany)
      .then(loadOne)
      .then(updatePreference)
      .then(createNote)
      .then(({ note, entity: addedCompany }) => {
        addedCompany.preferred = isPreferred;
        addedCompany.note = note;
        return addedCompany;
      });
  },

  del(id) {
    const deleteOne = () => Company.collection.updateOne({ _id: ObjectId(id) }, { $set: { updatedAt: new Date(), isDeleted: true } });
    const deletePreference = () => Preference.delete(this.user, id);
    const deleteNotes = () => Note.deleteForEntity(id);

    return deleteOne()
      .then(deletePreference)
      .then(deleteNotes)
      .then(id => ({ _id: id }));
  },
};

export const outMaker = (company) => {
  company.createdAt = company.createdAt || new Date(1967, 9, 1);
  return company;
};

export const outMakerMany = R.map(outMaker);

const init = (evtx) => {
  evtx.use(SERVICE_NAME, company);
  evtx.service(SERVICE_NAME)
    .before({ all: [checkUser()] })
    .after({
      load: [formatOutput(outMakerMany)],
      loadOne: [formatOutput(outMaker)],
      add: [formatOutput(outMaker), emitEvent('company:added'), emitNoteEvent('note:added')],
      del: [emitEvent('company:deleted')],
      update: [formatOutput(outMaker), emitEvent('company:updated')],
      setPreferred: [emitEvent('company:setPreferred')],
    });

  loginfo('companies service registered');
};

export default init;

/* eslint-disable no-shadow, no-param-reassign */
