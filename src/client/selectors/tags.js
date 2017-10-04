import {
  compose,
  flatten,
  pluck,
  values,
  filter,
  identity,
  reduce,
  concat,
  sort,
  descend,
  prop,
  map,
  toPairs,
  groupBy,
  match,
  isEmpty,
  sortBy,
  uniq,
} from 'ramda';
import { createSelector } from 'reselect';

const getCompanies = state => state.companies.data;
const getPeople = state => state.people.data;
const getFilter = state => state.tags.filter;

const getFlattenTags = compose(flatten, pluck('tags'), values);
const mergeTags = compose(
  filter(identity),
  reduce((tags, list) => concat(tags, getFlattenTags(list)), []),
);
const doSort = sort(descend(prop(1)));
const doFormat = compose(
  map(([tag, elts]) => [tag, elts.length]),
  toPairs,
  groupBy(identity),
);
const regexp = filter => new RegExp(filter, 'i');
const doFilter = tfilter => filter(x => !isEmpty(match(regexp(tfilter), x)));
const groupByFilterAndSort = (filter, ...lists) =>
  compose(doSort, doFormat, doFilter(filter))(mergeTags(lists));
const allTags = (...lists) => compose(sortBy(identity), uniq)(mergeTags(lists));

export const getVisibleTags = createSelector(
  [getFilter, getCompanies, getPeople],
  (filter, companies, people) =>
    groupByFilterAndSort(filter, companies, people),
);

export const getTags = createSelector(
  [getCompanies, getPeople],
  (companies, people) => allTags(companies, people),
);
