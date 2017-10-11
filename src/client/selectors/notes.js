import {
  filter,
  isEmpty,
  match,
  compose,
  values,
  sortBy,
  ifElse,
  is,
  toLower,
  identity,
  prop,
  reverse,
} from 'ramda';
import { createSelector } from 'reselect';

export const sortByProp = nprop =>
  sortBy(compose(ifElse(is(String), toLower, identity), prop(nprop)));
export const sortByOrder = order => (order === 'desc' ? reverse : identity);
export const doSort = ({ by, order }) =>
  by && by.length ? compose(sortByOrder(order), sortByProp(by)) : identity;

export const regexp = filter => new RegExp(filter, 'i');
export const nmatch = (filter, content) => match(filter, content).length;
export const doFilter = nfilter =>
  filter(note => nmatch(regexp(nfilter), note.content));

export const getFilter = state => state.notes.filter || '';
export const getSort = state => state.notes.sort;
export const getNotes = state => state.notes.data;

const filterAndSort = (filter, sort, notes) =>
  compose(doSort(sort), doFilter(filter), values)(notes);

export const getVisibleNotes = createSelector(
  [getFilter, getSort, getNotes],
  (filter, sort, notes) => {
    if (isEmpty(notes)) return [];
    return filterAndSort(filter, sort, notes);
  },
);
