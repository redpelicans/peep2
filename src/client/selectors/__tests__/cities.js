import should from 'should';
import {
  getCompanies,
  extractCities,
  filterUndefined,
  getCities,
} from '../cities';

describe('Selectors:cities', () => {
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
  it('Should extract cities from companies', () => {
    const state = {
      companies: {
        data: [
          { _id: '1', address: { city: 'test1' } },
          { _id: '2', address: { city: 'test2' } },
          { _id: '3', address: { city: 'test3' } },
          { _id: '4', address: { city: 'test4' } },
          { _id: '5', address: { city: 'test5' } },
        ],
      },
    };
    const companies = getCompanies(state);
    const data = extractCities(companies);
    should(data).eql(['test1', 'test2', 'test3', 'test4', 'test5']);
  });
  it('Should extract 3 cities and 2 undefined', () => {
    const state = {
      companies: {
        data: [
          { _id: '1', address: { city: 'test1' } },
          { _id: '2', address: { city: 'test2' } },
          { _id: '3', address: { city: 'test3' } },
          { _id: '4', address: {} },
          { _id: '5', address: {} },
        ],
      },
    };
    const companies = getCompanies(state);
    const data = extractCities(companies);
    should(data).eql(['test1', 'test2', 'test3', undefined, undefined]);
  });
  it('Should extract 3 cities and 2 undefined then filter', () => {
    const state = {
      companies: {
        data: [
          { _id: '1', address: { city: 'test1' } },
          { _id: '2', address: { city: 'test2' } },
          { _id: '3', address: { city: 'test3' } },
          { _id: '4', address: {} },
          { _id: '5', address: {} },
        ],
      },
    };
    const companies = getCompanies(state);
    const unfilteredData = extractCities(companies);
    const data = filterUndefined(unfilteredData);
    should(data).eql(['test1', 'test2', 'test3']);
  });
  it('Should filter but return same data than unfiltered data', () => {
    const state = {
      companies: {
        data: [
          { _id: '1', address: { city: 'test1' } },
          { _id: '2', address: { city: 'test2' } },
          { _id: '3', address: { city: 'test3' } },
          { _id: '4', address: { city: 'test4' } },
          { _id: '5', address: { city: 'test5' } },
        ],
      },
    };
    const companies = getCompanies(state);
    const unfilteredData = extractCities(companies);
    const data = filterUndefined(unfilteredData);
    should(data).eql(unfilteredData);
  });
  it('Should sort cities', () => {
    const state = {
      companies: {
        data: [
          { _id: '1', address: { city: 'a' } },
          { _id: '2', address: { city: 'c' } },
          { _id: '3', address: { city: 'e' } },
          { _id: '4', address: { city: 'd' } },
          { _id: '5', address: { city: 'b' } },
        ],
      },
    };
    const data = getCities(state);
    should(data).eql(['a', 'b', 'c', 'd', 'e']);
  });
  it('Should return same data than extract city', () => {
    const state = {
      companies: {
        data: [
          { _id: '1', address: { city: 'a' } },
          { _id: '2', address: { city: 'b' } },
          { _id: '3', address: { city: 'c' } },
          { _id: '4', address: { city: 'd' } },
          { _id: '5', address: { city: 'e' } },
        ],
      },
    };
    const companies = getCompanies(state);
    const extractedCities = extractCities(companies);
    const data = getCities(state);

    should(data).eql(extractedCities);
  });
});
