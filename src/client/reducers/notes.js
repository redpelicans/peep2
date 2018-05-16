import { compose, fromPairs, omit, map } from 'ramda';
import {
  NOTES_DELETED,
  NOTE_DELETED,
  NOTE_ADDED,
  NOTE_UPDATED,
  NOTES_LOADED,
  FILTER_NOTES_LIST,
  SORT_NOTES_LIST,
} from '../actions/notes';

const make = note => {
  const updatedNote = {
    ...note,
    typeName: 'note',
  };
  if (note.createdAt) updatedNote.createdAt = new Date(note.createdAt);
  if (note.updatedAt) updatedNote.updatedAt = new Date(note.updatedAt);
  if (note.dueDate) updatedNote.dueDate = new Date(note.dueDate);
  return updatedNote;
};

const makeAll = compose(fromPairs, map(o => [o._id, make(o)]));

const initialState = {
  data: {},
  sort: { by: 'createdAt', order: 'desc' },
  filter: '',
};

const notes = (state = initialState, action) => {
  switch (action.type) {
    case NOTE_ADDED:
      return {
        ...state,
        data: { ...state.data, [action.payload._id]: make(action.payload) },
      };
    case NOTE_UPDATED:
      return {
        ...state,
        data: { ...state.data, [action.payload._id]: make(action.payload) },
      };
    case NOTES_LOADED:
      return { ...state, data: makeAll(action.payload) };
    case FILTER_NOTES_LIST:
      return { ...state, filter: action.filter };
    case SORT_NOTES_LIST: {
      const { by, order } = state.sort;
      const newOrder = by === action.sortBy && order === 'asc' ? 'desc' : 'asc';
      return { ...state, sort: { by: action.sortBy, order: newOrder } };
    }
    case NOTE_DELETED:
      return { ...state, data: omit([action.payload._id], state.data) };
    case NOTES_DELETED:
      return { ...state, data: omit(action.payload, state.data) };
    default:
      return state;
  }
};

export default notes;
