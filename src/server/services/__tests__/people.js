import R from 'ramda';
import sinon from 'sinon';
import evtX from 'evtx';
import { ObjectId } from 'mongobless';
import { Person, Preference, Note } from '../../models';
import initPeople from '../people';
import initNotes from '../notes';
import params from '../../../../params';
import {
  manageError,
  manageFail,
  connect,
  close,
  drop,
} from '../../utils/tests';

const evtx = evtX()
  .configure(initPeople)
  .configure(initNotes);
const service = evtx.service('people');
const user = { _id: 0 };
const PERSON = {
  _id: new ObjectId(),
  prefix: 'Mr',
  firstName: 'firstName',
  lastName: 'lastName',
  type: 'client',
  email: 'email@email.fr',
  jobType: 'designer',
  companyId: new ObjectId(),
  tags: ['A', 'B'],
  phones: [{ label: 'phone1', number: 'number' }],
  tags: ['T1', 'T2'],
  skills: ['s1'],
  roles: ['role1'],
  avatar: { color: 'color' },
  fullName() {
    return 'fullName';
  },
};
const data = {
  collections: {
    people: [
      { ...PERSON, _id: new ObjectId() },
      { ...PERSON, _id: new ObjectId() },
    ],
  },
};

let db;
beforeAll(() => connect(params.db).then(ctx => (db = ctx)));
afterAll(close);

describe('People service', () => {
  beforeEach(() => drop(db));
  it('expect load', () => {
    const personStub = sinon
      .stub(Person, 'loadAll')
      .callsFake(() => Promise.resolve(data.collections.people));
    const end = e => {
      personStub.restore();
      manageError(e);
    };
    return service
      .load({}, { user })
      .then(people => {
        expect(people.map(n => n._id)).toEqual(
          data.collections.people.map(n => n._id),
        );
        end();
      })
      .catch(end);
  });

  it('expect check email correctness', () => {
    const p1 = { ...PERSON, email: 'toto.titi@redpelicans.com' };
    const p2 = { ...PERSON, email: 'titi.toto@redpelicans.com' };

    return service
      .add(p1, { user })
      .then(() => service.add(p2, { user }))
      .then(() => service.checkEmailUniqueness(p1.email, { user }))
      .then(({ ok }) => expect(ok).toBe(false))
      .then(() =>
        service.checkEmailUniqueness('tutu.titi@redpelicans.com', { user }),
      )
      .then(({ ok }) => expect(ok).toBe(true))
      .catch(manageError);
  });

  it('expect add', () => {
    const NOTE = 'note';
    const checkPerson = person => {
      expect(
        R.omit(
          ['_id', 'createdAt', 'constructor', 'authorId', 'name', 'isNew'],
          person,
        ),
      ).toEqual(R.omit(['_id', 'fullName'], PERSON));
      expect(person.authorId).toEqual(user._id);
      return person;
    };
    const checkNote = person =>
      Note.loadAllForEntity(person).then(notes => {
        expect(notes[0].entityId).toEqual(person._id);
        expect(notes[0].content).toEqual(NOTE);
        return person;
      });

    const newPerson = { ...R.omit(['_id'], PERSON), note: NOTE };
    return service
      .add(newPerson, { user })
      .then(checkPerson)
      .then(checkNote)
      .catch(manageError);
  });

  it('expect add will emit note:added', done => {
    const NOTE = 'note';
    const newPerson = { ...R.omit(['_id'], PERSON), note: NOTE };

    evtx.service('notes').once('note:added', ({ output }) => {
      expect(output.content).toEqual(NOTE);
      done();
    });
    service.add(newPerson, { user }).catch(manageFail);
  });

  it('expect add will emit person:added', done => {
    const NOTE = 'note';
    const checkPerson = person => {
      expect(
        R.omit(
          ['_id', 'createdAt', 'constructor', 'authorId', 'name', 'isNew'],
          person,
        ),
      ).toEqual(R.omit(['_id', 'fullName'], PERSON));
      expect(person.authorId).toEqual(user._id);
      return true;
    };

    const newPerson = { ...R.omit(['_id'], PERSON), note: NOTE };

    evtx.service('people').once('person:added', ({ output }) => {
      expect(checkPerson(output)).toEqual(true);
      done();
    });
    service.add(newPerson, { user }).catch(manageFail);
  });

  it('expect update', () => {
    const updates = {
      firstName: 'F2',
      avatar: { color: 'color2' },
      roles: ['Admin', 'Other', 'Test'],
      tags: ['Tag1', 'Tag2', 'Test'],
    };

    const checkObj = obj => {
      expect(obj.firstName).toEqual(updates.firstName);
      expect(obj.avatar).toEqual(updates.avatar);
      expect(obj.roles).toEqual(updates.roles);
      expect(obj.tags).toEqual(updates.tags);
      return obj;
    };

    const newPerson = { ...R.omit(['_id'], PERSON) };
    return service
      .add(newPerson, { user })
      .then(o =>
        service.update({ ...newPerson, _id: o._id, ...updates }, { user }),
      )
      .then(checkObj)
      .catch(manageError);
  });

  it('expect update will emit person:updated', done => {
    const updates = {
      firstName: 'F2',
      avatar: { color: 'color2' },
      roles: ['Admin', 'Other', 'Test'],
      tags: ['Tag1', 'Tag2', 'Test'],
    };

    const checkObj = obj => {
      expect(obj.firstName).toEqual(updates.firstName);
      expect(obj.avatar).toEqual(updates.avatar);
      expect(obj.roles).toEqual(updates.roles);
      expect(obj.tags).toEqual(updates.tags);
      return true;
    };

    const newPerson = { ...R.omit(['_id'], PERSON) };

    evtx.service('people').once('person:updated', ({ output }) => {
      expect(checkObj(output)).toEqual(true);
      done();
    });
    service
      .add(newPerson, { user })
      .then(o =>
        service.update({ ...newPerson, _id: o._id, ...updates }, { user }),
      )
      .catch(manageFail);
  });

  it('expect delete', () => {
    const checkObj = ({ _id }) =>
      Person.findOne({ _id }).then(p => {
        expect(p.isDeleted).toBe(true);
        return { _id };
      });
    const checkNote = ({ _id }) =>
      Note.loadAllForEntity({ _id }).then(notes => {
        expect(notes.length).toEqual(0);
        return { _id };
      });

    const newPerson = R.omit(['_id'], PERSON);
    return service
      .add(newPerson, { user })
      .then(({ _id }) => service.del({ _id }, { user }))
      .then(checkObj)
      .then(checkNote)
      .catch(manageError);
  });

  it('expect delete will emit person:deleted', done => {
    const checkObj = ({ _id }) => {
      return Person.findOne({ _id: ObjectId(_id) }).then(p => {
        expect(p);
        expect(p.isDeleted).toBe(true);
        return true;
      });
    };
    const newPerson = R.omit(['_id'], PERSON);
    evtx.service('people').once('person:deleted', ({ output }) => {
      expect(checkObj(output)).resolves.toEqual(true);
      done();
    });

    service
      .add(newPerson, { user })
      .then(({ _id }) => service.del({ _id }, { user }))
      .catch(manageFail);
  });
});
