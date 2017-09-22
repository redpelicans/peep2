/* eslint-disable no-shadow */
import { match, filter, concat, sortBy, compose, map, allPass, prop, split, values } from 'ramda';
import { createSelector } from 'reselect';
import { isWorker } from '../utils/people';

export const getFilter = state => state.people.filter || '';
export const getSort = state => state.people.sort;
export const getPeople = state => state.people.data;
const getPreferredFilter = state => state.people.preferredFilter;
const getCompanies = state => state.companies.data;
const getCompanyId = (state, props) => props.match.params.id;

const doSort = sortBy(prop('name'));
const regexp = filter => new RegExp(filter, 'i');
const getTagsPredicate = filter => ({ tags = [] }) => match(regexp(filter.slice(1)), tags.join(' ')).length;
const getNamePredicate = filter => ({ name, companyName }) => {
  const matchName = match(regexp(filter), name);
  const matchCompanyName = companyName && companyName.length > 0 ? match(regexp(filter), companyName) : [];
  return concat(matchName, matchCompanyName).length;
};
const getPreferredPredicate = filter => ({ preferred }) => !filter || !!preferred === !!filter;
const getPredicate = filter => (filter[0] === '#' ? getTagsPredicate(filter) : getNamePredicate(filter));
const getPredicates = filter => compose(map(getPredicate), split(' '))(filter);
const doFilter = (pfilter, preferredFilter) => filter(allPass([getPreferredPredicate(preferredFilter), ...getPredicates(pfilter)]));
const filterAndSort = (filter, preferredFilter, people) => compose(doSort, doFilter(filter, preferredFilter), values)(people);
const getCompanyName = companies => prop(['companyId', 'name'])(companies);
const peopleWithCompanyName = companies =>
  map(person => ({
    ...person,
    companyName: getCompanyName(companies, person),
  }));

export const getVisiblePeople = createSelector(
  [getFilter, getPreferredFilter, getPeople, getCompanies],
  (filter, preferredFilter, people, companies) => filterAndSort(filter, preferredFilter, peopleWithCompanyName(companies)(people)),
);

export const getPeopleFromCompany = createSelector([getPeople, getCompanyId], (people, companyId) =>
  compose(values, filter(person => person.companyId === companyId))(people),
);

export const getWorkers = createSelector([getPeople], people => compose(filter(isWorker), values)(people));

export const getSortedWorkers = attr => createSelector([getWorkers], people => sortBy(prop(attr), people));
