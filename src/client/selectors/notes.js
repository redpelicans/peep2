import R from 'ramda';
import { createSelector } from 'reselect';

const regexp = filter => new RegExp(filter, 'i');
const match = (filter, content) => R.match(filter, content).length;
const doFilter = (filter, notes) => R.filter(note => match(regexp(filter), note.content), notes);

const getFilter = state => state.notes.filter;
const getNotes = state => state.notes.data;

export const getVisibleNotes = createSelector( // eslint-disable-line
  [getFilter, getNotes],
  (filter = '', notes) =>
    doFilter(filter, notes)
);
