import { compose, fromPairs, map, omit } from 'ramda';

import {
  ADDENDA_LOADED,
  ADDENDUM_ADDED,
  ADDENDUM_UPDATED,
  ADDENDUM_DELETED,
  SET_FILTER,
} from '../actions/addenda';

const make = addendum => {
  return {
    ...addendum,
    startDate: new Date(addendum.startDate),
    endDate: addendum.endDate ? new Date(addendum.endDate) : undefined,
  };
};
const makeAll = compose(
  fromPairs,
  map(addendum => [addendum._id, make(addendum)]),
);

const initialState = {
  data: {},
  filter: 'current',
};

const addenda = (state = initialState, action) => {
  switch (action.type) {
    case ADDENDA_LOADED:
      return { ...state, data: makeAll(action.payload) };
    case ADDENDUM_ADDED:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload._id]: make(action.payload),
        },
      };
    case ADDENDUM_UPDATED:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload._id]: make(action.payload),
        },
      };
    case ADDENDUM_DELETED:
      return { ...state, data: omit([action.payload._id], state.data) };
    case SET_FILTER:
      return { ...state, filter: action.payload };
    default:
      return state;
  }
};

export default addenda;
