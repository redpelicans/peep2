import { map } from 'ramda';
import { format } from 'date-fns';
import {
  NOTES_LOADED,
  FILTER_NOTES_LIST,
  SORT_NOTES_LIST,
} from '../actions/notes';

const formatString = 'dddd, MMMM Do YYYY';

const make = note => {
  const updatedNote = {
    ...note,
    typeName: 'note',
    createdAt: note.createdAt
      ? format(note.createdAt, formatString)
      : undefined,
  };
  updatedNote.updatedAt = note.updatedAt
    ? format(note.updatedAt, formatString)
    : format(note.createdAt, formatString);
  return updatedNote;
};

const makeAll = map(n => make(n));

const initialState = {
  data: [],
  sort: { by: '', order: '' },
  filter: '',
};

const notes = (state = initialState, action) => {
  switch (action.type) {
    case NOTES_LOADED:
      return { ...state, data: makeAll(action.payload) };
    case FILTER_NOTES_LIST:
      return { ...state, filter: action.filter };
    case SORT_NOTES_LIST: {
      const { by, order } = state.sort;
      const newOrder = by === action.sortBy && order === 'asc' ? 'desc' : 'asc';
      return { ...state, sort: { by: action.sortBy, order: newOrder } };
    }
    default:
      return state;
  }
};

export default notes;
