import { map } from 'ramda';
import moment from 'moment';
import {
  NOTES_LOADED,
  FILTER_NOTES_LIST,
  SORT_NOTES_LIST,
} from '../actions/notes';

const make = note => {
  const updatedNote = {
    ...note,
    typeName: 'note',
    createdAt: moment(note.createdAt).format('dddd, MMMM Do YYYY'),
  };
  updatedNote.updatedAt = note.updatedAt
    ? moment(note.updatedAt).format('dddd, MMMM Do YYYY')
    : moment(note.createdAt).format('dddd, MMMM Do YYYY');
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
