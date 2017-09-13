import should from 'should';
import R from 'ramda';
import sinon from 'sinon';
import evtX from '../../lib/evtx';
import { Person, Preference, Note } from '../../models';
import initPeople, { people } from '../people';
import { connect, close, drop } from '../../models/__test__/utils';

const evtx = evtX().configure(initPeople);
const service = evtx.service('people');
const data = {
  collections:{
    preferences: [
      {
        personId : 0,
        entityId : 2,
        type : "person",
      },
      {
        personId : 0,
        entityId : 3,
        type : "person",
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
      }
    ]
  }
};

describe('People service', function() {
  before(() => connect(this));
  beforeEach(() => drop(this));
  after(close);

  it('should load', (done) => {
    const personStub = sinon.stub(Person, 'loadAll', () => Promise.resolve(data.collections.people));
    const preferenceStub = sinon.stub(Preference, 'findAll', () => Promise.resolve(data.collections.preferences));
    const end = (...params) => {
      personStub.restore();
      preferenceStub.restore();
      done(...params);
    };
    people.load.bind({ user: { _id: 0 } })()
      .then( people => {
        people.forEach(p => should(p.preferred === p._isPreferred));
        end();
    })
    .catch(end);
  });

  it('should check email correctness', (done) => {
    const p1 = { email: 'toto.titi@redpelicans.com' };
    const p2 = { email: 'titi.toto@redpelicans.com' };
    const user = { _id: 0 };

    service.add(p1, { user })
      .then(() => service.add(p2, { user }))
      .then(() => service.checkEmailUniqueness(p1.email))
      .then(({ ok }) => should(ok).false())
      .then(() => service.checkEmailUniqueness('tutu.titi@redpelicans.com'))
      .then(({ ok }) => should(ok).true())
      .then(() => done())
      .catch(done);
  });

  it('should add', (done) => {
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
        tags: [ 'Tag1', 'Tag2' ],
        isNew: true,
        preferred: true,
      };
      should(R.omit(['_id', 'companyId', 'createdAt', 'constructor'], person)).eql(res);
      return person;
    };
    const checkNote = (person) => {
      return Note.loadAllForEntity(person).then((notes) => {
        should(notes[0].entityId).eql(person._id);
        should(notes[0].content).eql(newPerson.note);
        return person;
      })
    };
    const checkPreferrence = (person) => {
      return Preference.loadAll('person', user).then((preferences) => {
        should(preferences[0].personId).eql(user._id);
        should(preferences[0].entityId).eql(person._id);
        return person;
      })
    };

    service.add(newPerson, { user })
      .then(checkPerson)
      .then(checkNote)
      .then(checkPreferrence)
      .then(() => done())
      .catch(done);
  });

  it('should toggle preferred', (done) => {
    const newPerson = { firstName: 'C1' };
    const user = { _id: 0 };
    const checkIsPreferred = (person) => {
      should(person.preferred).true();
      return Preference.loadAll('person', user).then((preferences) => {
        should(preferences[0].personId).eql(user._id);
        should(preferences[0].entityId).eql(person._id);
        return person;
      })
    };
    const checkIsNotPreferred = (person) => {
      should(person.preferred).false();
      return Preference.loadAll('person', user).then((preferences) => {
        should(preferences.length).eql(0);
        return person;
      })
    };

    service.add(newPerson, { user })
      .then(person => service.setPreferred({ _id: person._id, preferred: true }, { user }))
      .then(checkIsPreferred)
      .then(person => service.setPreferred({ _id: person._id, preferred: false }, { user }))
      .then(checkIsNotPreferred)
      .then(() => done())
      .catch(done);
  });

  it('should update', (done) => {
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
      tags: [ 'Tag1', 'Tag2', 'test' ],
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
        tags: [ 'Tag1', 'Tag2', 'Test' ],
        isUpdated: true,
        preferred: false,
      };
      should(R.omit(['_id', 'companyId', 'updatedAt', 'createdAt', 'constructor'], obj)).eql(res);
      return obj;
    };
    const checkPreferrence = (obj) => {
      return Preference.loadAll('person', user).then((preferences) => {
        should(preferences.length).eql(0);
        return obj;
      })
    };

    service
      .add(newObj, { user })
      .then(o => service.update({ _id: o._id, ...updates }, { user }))
      .then(checkObj)
      .then(checkPreferrence)
      .then(() => done())
      .catch(done);
  });

  it('should update tags', (done) => {
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
        tags: [ 'Tag11', 'Tag2', 'Tag3' ],
        isUpdated: true,
        preferred: false,
      };
      should(R.omit(['_id', 'companyId', 'updatedAt', 'createdAt', 'constructor'], obj)).eql(res);
      return obj;
    };

    service
      .add(newObj, { user })
      .then(o => service.update({ ...o, tags: ['tag11', 'tag3', 'tag2'] }, { user }))
      .then(checkObj)
      .then(() => done())
      .catch(done);
  });


  it('should delete', (done) => {
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
    const checkObj = (id) => {
      return Person.findOne({ _id: id }).then((p) => {
        should(p.isDeleted).true();
        return p._id;
      });
    };
    const checkPreferrence = (id) => {
      return Preference.loadAll('person', user).then((preferences) => {
        should(preferences.length).eql(0);
        return id;
      })
    };
    const checkNote = (id) => {
      return Note.loadAllForEntity({ _id: id }).then((notes) => {
        should(notes.length).eql(0);
        return id;
      })
    };

    service.add(newObj, { user })
      .then(({ _id }) => service.del(_id, { user }))
      .then(checkObj)
      .then(checkPreferrence)
      .then(checkNote)
      .then(() =>  done())
      .catch(done);
  });

});
