import R from 'ramda';
import { createSelector } from 'reselect';

const getCompanies = state => state.companies.data;

const extractCities = R.map(R.path(['address', 'city']));
const filterUndefined = R.filter(R.compose(R.not, R.isNil));

const getCities = createSelector(
  [getCompanies],
  R.compose(
    R.sortBy(R.toLower),
    R.uniqBy(R.toLower),
    filterUndefined,
    extractCities,
    R.values),
);

export default getCities;
