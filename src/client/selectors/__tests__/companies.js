import should from 'should';
import {
  getTagsPredicate,
  regexp,
  getCompanies,
  getNotes,
  getFilter,
  getSort,
  getCompany,
  sortByOrder,
  sortTag,
  groupCompanyTags,
  firstLevelReducer,
  getUnsortedTags,
  groupTags,
  isNew,
  isUpdated,
} from '../companies';

describe('Selectors:companies', () => {
  it('Should get an empty companies', () => {
    const state = {
      companies: {
        data: {},
      },
    };
    const companies = getCompanies(state);
    companies.should.be.empty();
  });
  it('Should get a non-empty companies', () => {
    const test = 'test';
    const state = {
      companies: { data: { test } },
    };
    const companies = getCompanies(state);
    should(companies).eql({ test });
  });
  it('Should get an empty sort', () => {
    const state = {
      companies: {
        sort: {},
      },
    };
    const sort = getSort(state);
    sort.should.be.empty();
  });
  it('Should get a non-empty sort', () => {
    const test = 'test';
    const state = {
      companies: { sort: { test } },
    };
    const sort = getSort(state);
    should(sort).eql({ test });
  });
  it('Should get an empty filter', () => {
    const state = {
      companies: {
        filter: {},
      },
    };
    const filter = getFilter(state);
    filter.should.be.empty();
  });
  it('Should get a non-empty filter', () => {
    const test = 'test';
    const state = {
      companies: { filter: { test } },
    };
    const filter = getFilter(state);
    should(filter).eql({ test });
  });
  it('Should get an empty notes', () => {
    const state = {
      notes: {
        data: {},
      },
    };
    const notes = getNotes(state);
    notes.should.be.empty();
  });
  it('Should get a non-empty notes', () => {
    const test = 'test';
    const state = {
      notes: { data: { test } },
    };
    const notes = getNotes(state);
    should(notes).eql({ test });
  });
  it('Should get an empty company', () => {
    const id = '1';
    const state = {
      companies: {
        data: {},
      },
    };
    const data = getCompany(state, id);
    should(data).eql(undefined);
  });
  it('Should newOrder equal asc', () => {
    const order = 'asc';
    const orderData = 'asc';
    const expected = 'asc';
    const newOrder = sortByOrder(order)(orderData);
    should(newOrder).eql(expected);
  });
  it('Should newOrder equal desc', () => {
    const order = 'asc';
    const orderData = 'desc';
    const expected = 'desc';
    const newOrder = sortByOrder(order)(orderData);
    should(newOrder).eql(expected);
  });
  it('Should sort tag by count', () => {
    const tags = [{ count: 1 }, { count: 4 }, { count: 2 }, { count: 15 }];
    const expected = [{ count: 15 }, { count: 4 }, { count: 2 }, { count: 1 }];
    const sortedTags = sortTag(tags);
    should(sortedTags).eql(expected);
  });
  it('Should get empty array', () => {
    const tags = [];
    const expected = [];
    const sortedTags = sortTag(tags);
    should(sortedTags).eql(expected);
  });
  it('Should get tag by company', () => {
    const company = { tags: ['a', 'b', 'c'] };
    const expected = {
      a: { label: 'a', count: 1 },
      b: { label: 'b', count: 1 },
      c: { label: 'c', count: 1 },
    };
    const companyTags = groupCompanyTags({}, company);
    should(companyTags).eql(expected);
  });
  it('Should get empty array for empty company tags', () => {
    const company = { tags: [] };
    const expected = {};
    const companyTags = groupCompanyTags({}, company);
    should(companyTags).eql(expected);
  });
  it('Should get a object containing count key with value 3', () => {
    const companies = [{ tags: ['a'] }, { tags: ['a'] }, { tags: ['a'] }];
    const expected = { a: { label: 'a', count: 3 } };
    const companiesTags = firstLevelReducer(companies);
    should(companiesTags).eql(expected);
  });
  it('Should get a, b, c object containing count key with value 3, 2, 1', () => {
    const companies = [
      { tags: ['a'] },
      { tags: ['a', 'b'] },
      { tags: ['a', 'b', 'c'] },
    ];
    const expected = {
      a: { label: 'a', count: 3 },
      b: { label: 'b', count: 2 },
      c: { label: 'c', count: 1 },
    };
    const companiesTags = firstLevelReducer(companies);
    should(companiesTags).eql(expected);
  });
  it('Should get empty object with empty companies', () => {
    const companies = [];
    const expected = {};
    const companiesTags = firstLevelReducer(companies);
    should(companiesTags).eql(expected);
  });
  it('Should get unsorted tags', () => {
    const companies = [
      { tags: ['c', 'a', 'b'] },
      { tags: ['b'] },
      { tags: ['c', 'b'] },
    ];
    const expected = {
      c: { label: 'c', count: 2 },
      a: { label: 'a', count: 1 },
      b: { label: 'b', count: 3 },
    };
    const companiesTags = getUnsortedTags(companies);
    should(companiesTags).eql(expected);
  });
  it('Should get empty object for empty tags', () => {
    const companies = [];
    const expected = {};
    const companiesTags = getUnsortedTags(companies);
    should(companiesTags).eql(expected);
  });
  it('Should groupTags group and sort tags', () => {
    const companies = [
      { tags: ['c', 'a', 'b'] },
      { tags: ['b'] },
      { tags: ['c', 'b'] },
    ];
    const expected = [
      { label: 'b', count: 3 },
      { label: 'c', count: 2 },
      { label: 'a', count: 1 },
    ];
    const companiesTags = groupTags(companies);
    should(companiesTags).eql(expected);
  });
  it('Should get empty object for empty tags', () => {
    const companies = [];
    const expected = [];
    const companiesTags = groupTags(companies);
    should(companiesTags).eql(expected);
  });
  it('newData.isNew should be false', () => {
    const company = {
      updatedAt: 'test',
    };
    const newData = {
      isNew: isNew(company),
    };
    const expected = false;
    should(newData.isNew).eql(expected);
  });
  it('newData.isNew should be true', () => {
    const company = {
      updatedAt: undefined,
      createdAt: Date.now(),
    };
    const newData = {
      isNew: isNew(company),
    };
    const expected = true;
    should(newData.isNew).eql(expected);
  });
  it('newData.isUpdated should be false', () => {
    const company = {
      updatedAt: 'test',
    };
    const newData = {
      isUpdated: isUpdated(company),
    };
    const expected = false;
    should(newData.isUpdated).eql(expected);
  });
  it('newData.isUpdated should be true', () => {
    const company = {
      updatedAt: Date.now(),
    };
    const newData = {
      isUpdated: isUpdated(company),
    };
    const expected = true;
    should(newData.isUpdated).eql(expected);
  });
  it('Should regexp work', () => {
    const test = 'TesTeu';
    test.should.match(regexp('testeu'));
  });
  it('Should regexp not work', () => {
    const test = 'aucunrapport';
    test.should.not.match(regexp('testeu'));
  });
});
