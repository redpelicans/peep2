import R from 'ramda';
import sinon from 'sinon';
import evtX from 'evtx';
import { Person, Preference, Note } from '../../models';
import initPeople, { people } from '../people';
import params from '../../../../params';
import { connect, close, drop } from '../../utils/tests';

const evtx = evtX().configure(initPeople);
const service = evtx.service('people');
const data = {
  collections: {
    preferences: [
      {
        personId: 0,
        entityId: 2,
        type: 'person',
      },
      {
        personId: 0,
        entityId: 3,
        type: 'person',
      },
    ],
    people: [
      {
        _id: 1,
        tags: ['A', 'B'],
        _isPreferred: false,
      },
      {
        _id: 2,
        tags: ['B'],
        _isPreferred: true,
      },
      {
        _id: 3,
        tags: ['B', 'C'],
        _isPreferred: true,
      },
    ],
  },
};

let db;
beforeAll(() => connect(params.db).then(ctx => db = ctx));
afterAll(close);

describe('People service', () => {
  beforeEach(() => drop(db));
  it('expect load', (done) => {
    const personStub = sinon.stub(Person, 'loadAll').callsFake(() => Promise.resolve(data.collections.people));
    const preferenceStub = sinon.stub(Preference, 'findAll').callsFake(() => Promise.resolve(data.collections.preferences));
    const end = (...params) => {
      personStub.restore();
      preferenceStub.restore();
      done(...params);
    };
    people.load.bind({ user: { _id: 0 } })()
      .then(people => {
        people.forEach(p => expect(p.preferred === p._isPreferred));
        end();
      })
      .catch(end);
  });

  it('expect check email correctness', (done) => {
    const p1 = { email: 'toto.titi@redpelicans.com' };
    const p2 = { email: 'titi.toto@redpelicans.com' };
    const user = { _id: 0 };

    service.add(p1, { user })
      .then(() => service.add(p2, { user }))
      .then(() => service.checkEmailUniqueness(p1.email))
      .then(({ ok }) => expect(ok).toBeFalse())
      .then(() => service.checkEmailUniqueness('tutu.titi@redpelicans.com'))
      .then(({ ok }) => expect(ok).toBeTrue())
      .then(() => done())
      .catch(done);
  });

  it('expect add', (done) => {
    const newPerson = {
      firstName: 'F1',
      lastName: 'L1',
      companyId: 1,
      type: 'worker',
      __trash__: 1,
      avatar: {
        color: 'color',
        __trash__: 1,
      },
      tags: ['TAG1', 'TAG1', 'TAG2'],
      roles: ['admin', 'other', 'other'],
      note: 'note',
      preferred: true,
    };
    const user = { _id: 0 };
    const checkPerson = (person) => {
      const res = {
        firstName: 'F1',
        lastName: 'L1',
        name: 'F1 L1',
        type: 'worker',
        avatar: { color: 'color' },
        roles: ['Admin', 'Other'],
        tags: ['Tag1', 'Tag2'],
        isNew: true,
        preferred: true,
      };
      expect(R.omit(['_id', 'companyId', 'createdAt', 'constructor'], person)).toEqual(res);
      return person;
    };
    const checkNote = (person) => Note.loadAllForEntity(person).then((notes) => {
      expect(notes[0].entityId).toEqual(person._id);
      expect(notes[0].content).toEqual(newPerson.note);
      return person;
    });
    const checkPreferrence = (person) => Preference.loadAll('person', user).then((preferences) => {
      expect(preferences[0].personId).toEqual(user._id);
      expect(preferences[0].entityId).toEqual(person._id);
      return person;
    });

    service.add(newPerson, { user })
      .then(checkPerson)
      .then(checkNote)
      .then(checkPreferrence)
      .then(() => done())
      .catch(done);
  });

  it('expect toggle preferred', (done) => {
    const newPerson = { firstName: 'C1' };
    const user = { _id: 0 };
    const checkIsPreferred = (person) => {
      expect(person.preferred).toBeTrue();
      return Preference.loadAll('person', user).then((preferences) => {
        expect(preferences[0].personId).toEqual(user._id);
        expect(preferences[0].entityId).toEqual(person._id);
        return person;
      });
    };
    const checkIsNotPreferred = (person) => {
      expect(person.preferred).toBeFalse();
      return Preference.loadAll('person', user).then((preferences) => {
        expect(preferences.length).toEqual(0);
        return person;
      });
    };

    service.add(newPerson, { user })
      .then(person => service.setPreferred({ _id: person._id, preferred: true }, { user }))
      .then(checkIsPreferred)
      .then(person => service.setPreferred({ _id: person._id, preferred: false }, { user }))
      .then(checkIsNotPreferred)
      .then(() => done())
      .catch(done);
  });

  it('expect update', (done) => {
    const newObj = {
      firstName: 'F1',
      lastName: 'L1',
      companyId: 1,
      type: 'worker',
      avatar: {
        color: 'color',
      },
      tags: ['TAG1', 'TAG1', 'TAG2'],
      roles: ['admin', 'other', 'other'],
      note: 'note',
      preferred: true,
    };
    const updates = {
      firstName: 'F2',
      companyId: 1,
      avatar: { color: 'color2' },
      roles: ['Admin', 'Other', 'test'],
      tags: ['Tag1', 'Tag2', 'test'],
      preferred: false,
    };

    const user = { _id: 0 };
    const checkObj = (obj) => {
      const res = {
        firstName: 'F2',
        lastName: 'L1',
        name: 'F2 L1',
        type: 'worker',
        avatar: { color: 'color2' },
        roles: ['Admin', 'Other', 'Test'],
        tags: ['Tag1', 'Tag2', 'Test'],
        isUpdated: true,
        preferred: false,
      };
      expect(R.omit(['_id', 'companyId', 'updatedAt', 'createdAt', 'constructor'], obj)).toEqual(res);
      return obj;
    };
    const checkPreferrence = (obj) => Preference.loadAll('person', user).then((preferences) => {
      expect(preferences.length).toEqual(0);
      return obj;
    });

    service
      .add(newObj, { user })
      .then(o => service.update({ _id: o._id, ...updates }, { user }))
      .then(checkObj)
      .then(checkPreferrence)
      .then(() => done())
      .catch(done);
  });

  it('expect update tags', (done) => {
    const newObj = {
      firstName: 'F1',
      lastName: 'L1',
      type: 'worker',
      tags: ['tag1', 'tag2'],
      type: 'worker',
    };

    const user = { _id: 0 };
    const checkObj = (obj) => {
      const res = {
        firstName: 'F1',
        lastName: 'L1',
        name: 'F1 L1',
        type: 'worker',
        tags: ['Tag11', 'Tag2', 'Tag3'],
        isUpdated: true,
        preferred: false,
      };
      expect(R.omit(['_id', 'companyId', 'updatedAt', 'createdAt', 'constructor'], obj)).toEqual(res);
      return obj;
    };

    service
      .add(newObj, { user })
      .then(o => service.update({ ...o, tags: ['tag11', 'tag3', 'tag2'] }, { user }))
      .then(checkObj)
      .then(() => done())
      .catch(done);
  });


  it('expect delete', (done) => {
    const newObj = {
      firstName: 'F1',
      lastName: 'L1',
      companyId: 1,
      type: 'worker',
      avatar: { color: 'color' },
      tags: ['TAG1', 'TAG1', 'TAG2'],
      roles: ['admin', 'other', 'other'],
      note: 'note',
      preferred: true,
    };

    const user = { _id: 0 };
    const checkObj = (id) => Person.findOne({ _id: id }).then((p) => {
      expect(p.isDeleted).toBeTrue();
      return p._id;
    });
    const checkPreferrence = (id) => Preference.loadAll('person', user).then((preferences) => {
      expect(preferences.length).toEqual(0);
      return id;
    });
    const checkNote = (id) => Note.loadAllForEntity({ _id: id }).then((notes) => {
      expect(notes.length).toEqual(0);
      return id;
    });

    service.add(newObj, { user })
      .then(({ _id }) => service.del(_id, { user }))
      .then(checkObj)
      .then(checkPreferrence)
      .then(checkNote)
      .then(() => done())
      .catch(done);
  });
});
