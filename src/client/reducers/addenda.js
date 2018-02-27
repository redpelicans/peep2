import { compose, fromPairs, map, omit } from 'ramda';

import {
  ADDENDA_LOADED,
  ADDENDUM_ADDED,
  ADDENDUM_UPDATED,
  ADDENDUM_DELETED,
} from '../actions/addenda';

const makeAll = compose(fromPairs, map(o => [o._id, o]));

const initialState = {
  data: {},
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
          [action.payload._id]: action.payload,
        },
      };
    case ADDENDUM_UPDATED:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload._id]: action.payload,
        },
      };
    case ADDENDUM_DELETED:
      return { ...state, data: omit([action.payload._id], state.data) };
    default:
      return state;
  }
};

export default addenda;
