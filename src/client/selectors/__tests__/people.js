import should from 'should';
import {
  getPeople,
  getFilter,
  getSort,
  getCompanies,
  getNotes,
} from '../people';

describe('Selectors:people', () => {
  it('Should get an empty people object', () => {
    const state = {
      people: { data: {} },
    };
    const people = getPeople(state);
    people.should.be.empty();
  });
  it('Should get a non empty people object', () => {
    const test = 'test';
    const state = {
      people: {
        data: {
          test,
        },
      },
    };
    const people = getPeople(state);
    people.should.not.be.empty();
    should(people).eql({ test });
  });
  it('Should get an empty sort object', () => {
    const state = {
      people: { sort: {} },
    };
    const sort = getSort(state);
    sort.should.be.empty();
  });
  it('Should get a non empty sort object', () => {
    const test = 'test';
    const state = {
      people: {
        sort: {
          test,
        },
      },
    };
    const sort = getSort(state);
    sort.should.not.be.empty();
    should(sort).eql({ test });
  });
  it('Should get an empty filter', () => {
    const state = {
      people: { filter: '' },
    };
    const filter = getFilter(state);
    filter.should.be.empty();
  });
  it('Should get a non empty filter object', () => {
    const test = 'test';
    const state = {
      people: {
        filter: test,
      },
    };
    const filter = getFilter(state);
    filter.should.not.be.empty();
    should(filter).eql(test);
  });
  it('Should get an empty notes object', () => {
    const state = {
      people: { filter: '' },
    };
    const filter = getFilter(state);
    filter.should.be.empty();
  });
  it('Should get a non empty filter object', () => {
    const test = 'test';
    const state = {
      people: {
        filter: test,
      },
    };
    const filter = getFilter(state);
    filter.should.not.be.empty();
    should(filter).eql(test);
  });
});
