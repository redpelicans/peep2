import should from 'should';
import {
  getCompanies,
  extractCountry,
  filterUndefined,
  getCountries,
} from '../countries';

describe('Selectors:countries', () => {
  it('Should get empty companies', () => {
    const state = {
      companies: {
        data: [],
      },
    };
    const data = getCompanies(state);
    data.should.be.empty();
  });
  it('Should get non empty companies', () => {
    const test = 'test';
    const state = {
      companies: {
        data: ['test'],
      },
    };
    const data = getCompanies(state);
    should(data).eql([test]);
  });
  it('Should extract countries from companies', () => {
    const state = {
      companies: {
        data: [
          { _id: '1', address: { country: 'test1' } },
          { _id: '2', address: { country: 'test2' } },
          { _id: '3', address: { country: 'test3' } },
          { _id: '4', address: { country: 'test4' } },
          { _id: '5', address: { country: 'test5' } },
        ],
      },
    };
    const companies = getCompanies(state);
    const data = extractCountry(companies);
    const expected = ['test1', 'test2', 'test3', 'test4', 'test5'];
    should(data).eql(expected);
  });
  it('Should extract 3 countries and 2 undefined', () => {
    const state = {
      companies: {
        data: [
          { _id: '1', address: { country: 'test1' } },
          { _id: '2', address: { country: 'test2' } },
          { _id: '3', address: { country: 'test3' } },
          { _id: '4', address: {} },
          { _id: '5', address: {} },
        ],
      },
    };
    const companies = getCompanies(state);
    const data = extractCountry(companies);
    const expected = ['test1', 'test2', 'test3', undefined, undefined];
    should(data).eql(expected);
  });
  it('Should extract 3 countries and 2 undefined then filter', () => {
    const state = {
      companies: {
        data: [
          { _id: '1', address: { country: 'test1' } },
          { _id: '2', address: { country: 'test2' } },
          { _id: '3', address: { country: 'test3' } },
          { _id: '4', address: {} },
          { _id: '5', address: {} },
        ],
      },
    };
    const companies = getCompanies(state);
    const unfilteredData = extractCountry(companies);
    const data = filterUndefined(unfilteredData);
    const expected = ['test1', 'test2', 'test3'];
    should(data).eql(expected);
  });
  it('Should filter but return same data than unfiltered data', () => {
    const state = {
      companies: {
        data: [
          { _id: '1', address: { country: 'test1' } },
          { _id: '2', address: { country: 'test2' } },
          { _id: '3', address: { country: 'test3' } },
          { _id: '4', address: { country: 'test4' } },
          { _id: '5', address: { country: 'test5' } },
        ],
      },
    };
    const companies = getCompanies(state);
    const unfilteredData = extractCountry(companies);
    const data = filterUndefined(unfilteredData);
    should(data).eql(unfilteredData);
  });
  it('Should sort countries', () => {
    const state = {
      companies: {
        data: [
          { _id: '1', address: { country: 'a' } },
          { _id: '2', address: { country: 'c' } },
          { _id: '3', address: { country: 'e' } },
          { _id: '4', address: { country: 'd' } },
          { _id: '5', address: { country: 'b' } },
        ],
      },
    };
    const data = getCountries(state);
    const expected = ['a', 'b', 'c', 'd', 'e'];
    should(data).eql(expected);
  });
  it('Should return same data than extract country', () => {
    const state = {
      companies: {
        data: [
          { _id: '1', address: { country: 'a' } },
          { _id: '2', address: { country: 'b' } },
          { _id: '3', address: { country: 'c' } },
          { _id: '4', address: { country: 'd' } },
          { _id: '5', address: { country: 'e' } },
        ],
      },
    };
    const companies = getCompanies(state);
    const expected = extractCountry(companies);
    const data = getCountries(state);
    should(data).eql(expected);
  });
});
