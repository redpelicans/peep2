import should from 'should';
import sinon from 'sinon';
import { tags } from '../tags';
import { Person, Company } from '../../models';

const data = {
  collections:{
    companies: [
      {
        _id: 1,
      },
      {
        _id: 1,
        tags: ['A', 'B'],
      },
    ],
    people: [
      {
        _id: 1,
        tags: ['A', 'B'],
      },
      {
        _id: 2,
        tags: ['B'],
      },
      {
        _id: 3,
        tags: ['B', 'C'],
      }
    ]
  }
};

describe('Tags services', function() {
  it('should load', (done) => {
    const personStub = sinon.stub(Person, 'findAll', () => Promise.resolve(data.collections.people));
    const companyStub = sinon.stub(Company, 'findAll', () => Promise.resolve(data.collections.companies));
    const end = (...params) => {
      personStub.restore();
      companyStub.restore();
      done(...params);
    }
    tags.load()
      .then( tags => {
        should(tags).eql([['A', 2], ['B', 4], ['C', 1]]);
        end();
    })
    .catch(end);
  });

});


