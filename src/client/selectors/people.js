/* eslint-disable no-shadow */
import {
  sort,
  match,
  filter,
  concat,
  sortBy,
  compose,
  map,
  allPass,
  prop,
  split,
  values,
  ifElse,
  is,
  toLower,
  identity,
  reverse,
  reduce,
  descend,
  pathOr,
  isEmpty,
} from 'ramda';
import { createSelector } from 'reselect';
import { isWorker } from '../utils/people';

export const getFilter = state => state.people.filter || '';
export const getSort = state => state.people.sort;
export const getPeople = state => state.people.data;
const getPreferredFilter = state => state.people.preferredFilter;
const getCompanies = state => state.companies.data;
const getNotes = state => state.notes.data;
const getCompanyId = (state, props) => props.match.params.id;

export const getPersonNotes = (state, props) => {
  const notes = getNotes(state);
  if (isEmpty(notes)) return null
  return filter(note => note.entityId === props.entityId, notes);
}

const sortByProp = pprop =>
sortBy(
  compose(ifElse(is(String), toLower, identity), prop(pprop)),
);
const sortByOrder = order => (order === 'desc' ? reverse : identity);
const doSort = ({ by, order }) =>
by && by.length ? compose(sortByOrder(order), sortByProp(by)) : identity;

const regexp = filter => new RegExp(filter, 'i');
const getTagsPredicate = filter => ({ tags = [] }) =>
  match(regexp(filter.slice(1)), tags.join(' ')).length;
const getNamePredicate = filter => ({ name, companyName }) => {
  const matchName = match(regexp(filter), name);
  const matchCompanyName =
    companyName && companyName.length > 0
      ? match(regexp(filter), companyName)
      : [];
  return concat(matchName, matchCompanyName).length;
};
const getPreferredPredicate = filter => ({ preferred }) =>
  !filter || !!preferred === !!filter;
const getPredicate = filter =>
  filter[0] === '#' ? getTagsPredicate(filter) : getNamePredicate(filter);
const getPredicates = filter => compose(map(getPredicate), split(' '))(filter);
const doFilter = (pfilter, preferredFilter) =>
  filter(
    allPass([
      getPreferredPredicate(preferredFilter),
      ...getPredicates(pfilter),
    ]),
  );
const filterAndSort = (filter, sort, preferredFilter, people) =>
  compose(doSort(sort), doFilter(filter, preferredFilter), values)(people);
const getCompanyName = companies => prop(['companyId', 'name'])(companies);
const peopleWithCompanyName = companies =>
  map(person => ({
    ...person,
    companyName: getCompanyName(companies, person),
  }));

export const getVisiblePeople = createSelector(
  [getFilter, getSort, getPreferredFilter, getPeople, getCompanies],
  (filter, sort, preferredFilter, people, companies) =>
    filterAndSort(
      filter,
      sort,
      preferredFilter,
      peopleWithCompanyName(companies)(people),
    ),
);

export const getPeopleFromCompany = createSelector(
  [getPeople, getCompanyId],
  (people, companyId) =>
    compose(values, filter(person => person.companyId === companyId))(people),
);

export const getWorkers = createSelector([getPeople], people =>
  compose(filter(isWorker))(people),
);

export const getSortedWorkers = attr =>
  createSelector(getWorkers, compose(sortBy(prop(attr)), values));

const groupPersonTags = (acc, person) => {
  const tags = person.tags || [];
  return reduce((acc2, tag) => ({ ...acc2, [tag]: { label: tag, count: pathOr(0, [tag, 'count'], acc) + 1 } }), acc, tags);
}

const firstLevelReducer = reduce((acc, person) => groupPersonTags(acc, person), {});
const sortTag = sort(descend(prop('count')));

const getTagsUnsorted = compose(firstLevelReducer, values);
const groupTags = compose(sortTag, values, getTagsUnsorted);

export const getGroupedTagsByCount = createSelector(
  getPeople,
  groupTags,
);

