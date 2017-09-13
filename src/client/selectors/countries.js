import R from 'ramda';
import { createSelector } from 'reselect';

const getCompanies = state => state.companies.data;

const extractCountry = R.map(R.path(['address', 'country']));
const filterUndefined = R.filter(R.compose(R.not, R.isNil));

const getCountries = createSelector(
  [getCompanies],
  R.compose(
    R.sortBy(R.toLower),
    R.uniqBy(R.toLower),
    filterUndefined,
    extractCountry,
    R.values),
);

export default getCountries;
