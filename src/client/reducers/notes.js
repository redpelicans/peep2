import R from 'ramda';
import moment from 'moment';
import { NOTES_LOADED, FILTER_NOTES_LIST } from '../actions/notes';

const make = (note) => {
  const updatedNote = { ...note, typeName: 'note', createdAt: moment(note.createdAt).format('dddd, MMMM Do YYYY') };
  updatedNote.updatedAt = note.updatedAt  ? moment(note.updatedAt).format('dddd, MMMM Do YYYY') :  moment(note.createdAt).format('dddd, MMMM Do YYYY');
  return updatedNote;
};

const makeAll = R.map(n => make(n));

const notes = (state = { data: [] }, action) => {
  switch (action.type) {
    case NOTES_LOADED:
      return { ...state, data: makeAll(action.payload) };
    case FILTER_NOTES_LIST:
      return { ...state, filter: action.filter };
    default:
      return state;
  }
};

export default notes;
