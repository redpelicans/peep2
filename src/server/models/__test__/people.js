import should from 'should';
import mongobless from 'mongobless';
import config from '../../../../config';
import { Person } from '..';
import { connect, close, drop, load } from './utils';

const data = {
  collections:{
    people: [
      {
        _id: 1,
        firstName: 'A',
        lastName: 'lastName1',
        roles: ['admin', 'role1', 'role2'],
        type: 'worker',
        _fullName: 'A lastName1',
      },
      {
        firstName: 'B',
        lastName: 'lastName1',
      },
      {
        firstName: 'C',
        lastName: 'lastName1',
      },
      {
        isDeleted: true,
        firstName: 'D',
        lastName: 'lastName1',
      }
    ]
  }
};

describe('People models', function() {
  before(() => connect(this));
  beforeEach(() => drop(this).then(() => load(this, data)));
  after(close);

  it('should find all', (done) => {
    Person
      .loadAll()
      .then( people => {
        const names = people.map(person => person.firstName).join('');
        const res = data.collections.people
          .filter(person => !person.isDeleted)
          .map(person => person.firstName).join('');
        should(names).equal(res);
        done();
    })
    .catch(done);
  });

  it('should load all', (done) => {
    Person
      .loadAll({ firstName: 'B' })
      .then( people => {
        const names = people.map(person => person.firstName).join('');
        should(names).equal('B');
        done();
    })
    .catch(done);
  });


  it('should load one', (done) => {
    const { _id, _fullName, roles } = data.collections.people[0];
    Person
      .loadOne(_id)
      .then( person => {
        should(person._id).equal(_id);
        should(person.fullName()).equal(_fullName);
        should(person.isAdmin()).true();
        should(person.isWorker()).true();
        should(person.hasSomeRoles(['role1', 'admin', 'toto'])).true();
        should(person.hasAllRoles(['role1', 'admin'])).true();
        should(person.hasAllRoles(['role1', 'admin', 'toto'])).false();
        should(person.hasAllRoles([])).true();
        should(person.hasSomeRoles()).true();
        done();
    })
    .catch(done);
  });

 
  it('should find one', (done) => {
    const firstName = data.collections.people[0].firstName;
    Person
      .findOne({ firstName })
      .then( person => {
        should(person.firstName).equal(firstName);
        done();
    })
    .catch(done);
  });

});


