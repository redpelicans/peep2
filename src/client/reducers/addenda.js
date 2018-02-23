import { omit } from 'ramda';

import {
  // ADD_ADDENDUM,
  ADDENDUM_ADDED,
  // UPDATE_ADDENDUM,
  ADDENDUM_UPDATED,
  ADDENDUM_DELETED,
} from '../actions/addenda';

const initialState = {
  data: {},
};

const addenda = (state = initialState, action) => {
  switch (action.type) {
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
