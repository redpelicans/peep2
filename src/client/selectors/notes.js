import { filter, match } from 'ramda';
import { createSelector } from 'reselect';

const regexp = filter => new RegExp(filter, 'i');
const nmatch = (filter, content) => match(filter, content).length;
const doFilter = (nfilter, notes) =>
  filter(note => nmatch(regexp(nfilter), note.content), notes);

export const getFilter = state => state.notes.filter || '';
const getNotes = state => state.notes.data;

export const getVisibleNotes = createSelector(
  [getFilter, getNotes],
  (filter, notes) => doFilter(filter, notes),
);
