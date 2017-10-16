import {
  compose,
  sortBy,
  map,
  path,
  filter,
  not,
  isNil,
  uniqBy,
  toLower,
  values,
  isEmpty,
} from 'ramda';
import { createSelector } from 'reselect';

export const getCompanies = state => state.companies.data;

export const extractCountry = map(path(['address', 'country']));
export const filterUndefined = filter(compose(not, isNil));
export const filterEmpty = filter(compose(not, isEmpty));

export const getCountries = createSelector(
  [getCompanies],
  compose(
    sortBy(toLower),
    uniqBy(toLower),
    filterUndefined,
    filterEmpty,
    extractCountry,
    values,
  ),
);

export default getCountries;
