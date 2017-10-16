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
import { getCompanies } from './companies';

export const getFilter = state => state.people.filter || '';
export const getSort = state => state.people.sort;
export const getPeople = state => state.people.data;
export const getPerson = (state, id) => state.people.data[id];
const getCompanyId = (state, props) => props.match.params.id;
const getPreferredFilter = state => state.people.preferredFilter;

const sortByProp = pprop =>
  sortBy(compose(ifElse(is(String), toLower, identity), prop(pprop)));
const sortByOrder = order => (order === 'desc' ? reverse : identity);
const doSort = ({ by, order }) =>
  by && by.length ? compose(sortByOrder(order), sortByProp(by)) : identity;

const regexp = filter => new RegExp(filter, 'i');
const getTagsPredicate = filter => ({ tags = [] }) =>
  match(regexp(filter.slice(1)), tags.join(' ')).length;
const getRolesPredicate = filter => ({ roles = [] }) => {
  if (roles === null) roles = [];
  return match(regexp(filter.slice(1)), roles.join(' ')).length;
};
const getTypesPredicate = filter => ({ type = '' }) =>
  match(regexp(filter.substring(1)), type).length;
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
const getPredicate = filter => {
  switch (filter[0]) {
    case '#':
      return getTagsPredicate(filter);
    case '~':
      return getTypesPredicate(filter);
    case '&':
      return getRolesPredicate(filter);
    default:
      return getNamePredicate(filter);
  }
};
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

export const getWorker = id =>
  createSelector([getPeople], people => people[id]);

export const getWorkers = createSelector([getPeople], people =>
  compose(filter(isWorker))(people),
);

export const getSortedWorkers = attr =>
  createSelector(getWorkers, compose(sortBy(prop(attr)), values));

const groupPersonTypes = (acc, person) => {
  const type = person.type || '';
  return {
    ...acc,
    [type]: { label: type, count: pathOr(0, [type, 'count'], acc) + 1 },
  };
};

const typesFirstLevelReducer = reduce(
  (acc, person) => groupPersonTypes(acc, person),
  {},
);
const sortTypes = sort(descend(prop('count')));

const getTypesUnsorted = compose(typesFirstLevelReducer, values);
const groupTypes = compose(sortTypes, values, getTypesUnsorted);

export const getGroupedTypesByCount = createSelector(getPeople, groupTypes);

const groupPersonRoles = (acc, person) => {
  const roles = person.roles || [];
  return reduce(
    (acc2, role) => ({
      ...acc2,
      [role]: { label: role, count: pathOr(0, [role, 'count'], acc) + 1 },
    }),
    acc,
    roles,
  );
};

const rolesFirstLevelReducer = reduce(
  (acc, person) => groupPersonRoles(acc, person),
  {},
);
const sortRoles = sort(descend(prop('count')));

const getRolesUnsorted = compose(rolesFirstLevelReducer, values);
const groupRoles = compose(sortRoles, values, getRolesUnsorted);

export const getGroupedRolesByCount = createSelector(getPeople, groupRoles);

const groupPersonTags = (acc, person) => {
  const tags = person.tags || [];
  return reduce(
    (acc2, tag) => ({
      ...acc2,
      [tag]: { label: tag, count: pathOr(0, [tag, 'count'], acc) + 1 },
    }),
    acc,
    tags,
  );
};

const tagsFirstLevelReducer = reduce(
  (acc, person) => groupPersonTags(acc, person),
  {},
);
const sortTag = sort(descend(prop('count')));

const getTagsUnsorted = compose(tagsFirstLevelReducer, values);
const groupTags = compose(sortTag, values, getTagsUnsorted);

export const getGroupedTagsByCount = createSelector(getPeople, groupTags);
