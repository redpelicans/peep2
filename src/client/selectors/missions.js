import {
  sortBy,
  ifElse,
  is,
  identity,
  reverse,
  toLower,
  prop,
  values,
  match,
  split,
  compose,
  map,
  filter,
  allPass,
} from 'ramda';
import { createSelector } from 'reselect';

const sortByProp = mprop =>
  sortBy(compose(ifElse(is(String), toLower, identity), prop(mprop)));
const sortByOrder = order => (order === 'desc' ? reverse : identity);
const doSort = ({ by, order }) =>
  by && by.length ? compose(sortByOrder(order), sortByProp(by)) : identity;

export const regexp = filter => new RegExp(filter, 'i');
const getNamePredicate = filter => ({ name }) =>
  match(regexp(filter), name).length;
const getPredicate = filter => getNamePredicate(filter);
const getPredicates = filter => compose(map(getPredicate), split(' '))(filter);
const doFilter = mfilter => filter(allPass([...getPredicates(mfilter)]));

const filterAndSort = (filter, sort, missions) =>
  compose(doSort(sort), doFilter(filter), values)(missions);

export const getFilter = state => state.missions.filter;
export const getSort = state => state.missions.sort;
export const getMissions = state => state.missions.data;
export const getMission = (state, id) => state.missions.data[id];

export const getVisibleMissions = createSelector(
  [getFilter, getSort, getMissions],
  (filter, sort, missions) => filterAndSort(filter, sort, missions),
);
