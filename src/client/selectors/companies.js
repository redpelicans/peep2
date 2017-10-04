import {
  descend,
  reduce,
  pathOr,
  values,
  mapObjIndexed,
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
  prop,
  isEmpty,
} from 'ramda';
import moment from 'moment';
import { createSelector } from 'reselect';

const getNotes = state => state.notes.data;

export const getCompanyNotes = (state, props) => {
  const notes = getNotes(state);
  if (isEmpty(notes)) return null;
  return filter(note => note.entityId === props.entityId, notes);
};

/* sorting */
const sortByProp = cprop =>
  sortBy(compose(ifElse(is(String), toLower, identity), prop(cprop)));
const sortByOrder = order => (order === 'desc' ? reverse : identity);
const doSort = ({ by, order }) =>
  by && by.length ? compose(sortByOrder(order), sortByProp(by)) : identity;

/* filtering */
const regexp = filter => new RegExp(filter, 'i');
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

/* status */
const isNew = company =>
  !company.updatedAt &&
  moment.duration(moment() - company.createdAt).asHours() < 2;
const isUpdated = company =>
  company.updatedAt &&
  moment.duration(moment() - company.updatedAt).asHours() < 1;
const putStatus = companies =>
  mapObjIndexed(company => ({
    ...company,
    isNew: isNew(company),
    isUpdated: isUpdated(company),
  }))(companies);

/* input selectors */
export const getFilter = state => state.companies.filter;
export const getSort = state => state.companies.sort;
export const getCompanies = state => state.companies.data;
export const getCompanyId = (companies, name) =>
  prop('_id', find(propEq('name', name), companies));
const getPreferredFilter = state => state.companies.preferredFilter;
/* selectors */
const updateCompaniesStatus = createSelector(getCompanies, putStatus);

export const getVisibleCompanies = createSelector(
  [getFilter, getSort, getPreferredFilter, updateCompaniesStatus],
  (filter, sort, preferredFilter, companies) =>
    filterAndSort(filter, sort, preferredFilter, companies),
);

const groupCompanyTags = (acc, company) => {
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

const firstLevelReducer = reduce(
  (acc, company) => groupCompanyTags(acc, company),
  {},
);
const sortTag = sort(descend(prop('count')));

const getUnsortedTags = compose(firstLevelReducer, values);
const groupTags = compose(sortTag, values, getUnsortedTags);

export const getGroupedTagsByCount = createSelector(getCompanies, groupTags);
