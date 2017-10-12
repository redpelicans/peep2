import { compose, fromPairs, map, omit } from 'ramda';
import {
  PEOPLE_LOADED,
  FILTER_PEOPLE_LIST,
  TOGGLE_PREFERRED_FILTER,
  ADD_PEOPLE,
  PEOPLE_ADDED,
  PEOPLE_UPDATED,
  PEOPLE_DELETED,
  SORT_PEOPLE_LIST,
} from '../actions/people';

const make = person => {
  const { firstName, lastName } = person;
  const updatedPerson = {
    ...person,
    name: `${firstName} ${lastName}`,
    typeName: 'person',
    createdAt: person.createdAt ? person.createdAt : undefined,
  };
  if (person.updatedAt) updatedPerson.updatedAt = person.updatedAt;
  return updatedPerson;
};

const makeAll = compose(fromPairs, map(o => [o._id, make(o)]));

const initialState = {
  data: {},
  sort: { by: 'name', order: 'asc' },
  filter: '',
};

const people = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_PREFERRED_FILTER:
      return { ...state, preferredFilter: !state.preferredFilter };
    case SORT_PEOPLE_LIST: {
      const { by, order } = state.sort;
      const newOrder = by === action.sortBy && order === 'asc' ? 'desc' : 'asc';
      return { ...state, sort: { by: action.sortBy, order: newOrder } };
    }
    case FILTER_PEOPLE_LIST:
      return { ...state, filter: action.filter };
    case PEOPLE_LOADED:
      return { ...state, data: makeAll(action.payload) };
    case ADD_PEOPLE:
      return { ...state, pending_action: true };
    case PEOPLE_ADDED:
      return {
        ...state,
        pending_action: false,
        data: {
          ...state.data,
          [action.payload._id]: make(action.payload),
        },
      };
    case PEOPLE_UPDATED:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload._id]: make(action.payload),
        },
      };
    case PEOPLE_DELETED:
      return { ...state, data: omit([action.payload._id])(state.data) };
    default:
      return state;
  }
};

export default people;
