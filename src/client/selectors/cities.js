import {
  path,
  map,
  filter,
  compose,
  sortBy,
  toLower,
  uniqBy,
  values,
  not,
  isNil,
} from 'ramda';
import { createSelector } from 'reselect';

export const getCompanies = state => state.companies.data;

export const extractCities = map(path(['address', 'city']));
export const filterUndefined = filter(compose(not, isNil));

export const getCities = createSelector(
  [getCompanies],
  compose(
    sortBy(toLower),
    uniqBy(toLower),
    filterUndefined,
    extractCities,
    values,
  ),
);

export default getCities;
