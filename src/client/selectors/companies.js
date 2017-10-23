import {
  descend,
  reduce,
  pathOr,
  values,
  map,
  sortBy,
  compose,
  ifElse,
  is,
  toLower,
  identity,
  prop,
  reverse,
  match,
  split,
  filter,
  allPass,
  sort,
  propEq,
  find,
} from 'ramda';
import { createSelector } from 'reselect';

/* sorting */
export const sortByProp = cprop =>
  sortBy(compose(ifElse(is(String), toLower, identity), prop(cprop)));
export const sortByOrder = order => (order === 'desc' ? reverse : identity);
export const doSort = ({ by, order }) =>
  by && by.length ? compose(sortByOrder(order), sortByProp(by)) : identity;

/* filtering */
export const regexp = filter => new RegExp(filter, 'i');
const getTagsPredicate = filter => ({ tags = [] }) =>
  match(regexp(filter.slice(1)), tags.join(' ')).length;
const getNamePredicate = filter => ({ name }) =>
  match(regexp(filter), name).length;
const getPredicate = filter =>
  filter[0] === '#' ? getTagsPredicate(filter) : getNamePredicate(filter);
const getPredicates = filter => compose(map(getPredicate), split(' '))(filter);
const getPreferredPredicate = filter => ({ preferred }) =>
  !filter || !!preferred === !!filter;
const doFilter = (cfilter, preferredFilter) =>
  filter(
    allPass([
      getPreferredPredicate(preferredFilter),
      ...getPredicates(cfilter),
    ]),
  );

const filterAndSort = (filter, sort, preferredFilter, companies) =>
  compose(doSort(sort), doFilter(filter, preferredFilter), values)(companies);

/* input selectors */
export const getFilter = state => state.companies.filter;
export const getSort = state => state.companies.sort;
export const getCompanies = state => state.companies.data;
export const getCompany = (state, id) => state.companies.data[id];
export const getCompanyId = (companies, name) =>
  prop('_id', find(propEq('name', name), companies));
const getPreferredFilter = state => state.companies.preferredFilter;
/* selectors */

export const getVisibleCompanies = createSelector(
  [getFilter, getSort, getPreferredFilter, getCompanies],
  (filter, sort, preferredFilter, companies) =>
    filterAndSort(filter, sort, preferredFilter, companies),
);

export const groupCompanyTags = (acc, company) => {
  const tags = company.tags || [];
  return reduce(
    (acc2, tag) => ({
      ...acc2,
      [tag]: { label: tag, count: pathOr(0, [tag, 'count'], acc) + 1 },
    }),
    acc,
    tags,
  );
};

export const firstLevelReducer = reduce(
  (acc, company) => groupCompanyTags(acc, company),
  {},
);

export const sortTag = sort(descend(prop('count')));

export const getUnsortedTags = compose(firstLevelReducer, values);
export const groupTags = compose(sortTag, values, getUnsortedTags);

export const getGroupedTagsByCount = createSelector(getCompanies, groupTags);
