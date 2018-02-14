import { ADD_ADDENDUM, ADDENDUM_ADDED } from '../actions/addenda';

const initialState = {
  data: {},
};

const addenda = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ADDENDUM:
      return { ...state };
    case ADDENDUM_ADDED:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload._id]: action.payload,
        },
      };
    default:
      return state;
  }
};

export default addenda;
