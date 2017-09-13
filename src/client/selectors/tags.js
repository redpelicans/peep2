import R from 'ramda';
import { createSelector } from 'reselect';

const getCompanies = state => state.companies.data;
const getPeople = state => state.people.data;
const getFilter = state => state.tags.filter;

const getFlattenTags = R.compose(R.flatten, R.pluck('tags'), R.values);
const mergeTags = R.compose(R.filter(R.identity), R.reduce((tags, list) => R.concat(tags, getFlattenTags(list)), []));
const doSort = R.sort(R.descend(R.prop(1)));
const doFormat = R.compose(R.map(([tag, elts]) => [tag, elts.length]), R.toPairs, R.groupBy(R.identity));
const regexp = filter => new RegExp(filter, 'i');
const doFilter = filter => R.filter(x => !R.isEmpty(R.match(regexp(filter), x)));
const groupByFilterAndSort = (filter, ...lists) => R.compose(doSort, doFormat, doFilter(filter))(mergeTags(lists));
const allTags = (...lists) => R.compose(R.sortBy(R.identity), R.uniq)(mergeTags(lists));

export const getVisibleTags = createSelector(
  [getFilter, getCompanies, getPeople],
  (filter, companies, people) => groupByFilterAndSort(filter, companies, people),
);

export const getTags = createSelector(
  [getCompanies, getPeople],
  (companies, people) => allTags(companies, people),
);
