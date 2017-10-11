import { filter, match } from 'ramda';
import { createSelector } from 'reselect';

export const regexp = filter => new RegExp(filter, 'i');
export const nmatch = (filter, content) => match(filter, content).length;
export const doFilter = (nfilter, notes) =>
  filter(note => nmatch(regexp(nfilter), note.content), notes);

export const getFilter = state => state.notes.filter || '';
export const getSort = state => state.notes.sort;
export const getNotes = state => state.notes.data;

export const getVisibleNotes = createSelector(
  [getFilter, getNotes],
  (filter, notes) => doFilter(filter, notes),
);
