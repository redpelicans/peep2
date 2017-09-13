import { FILTER_TAGS } from '../actions/tags';

const tags = (state = { data: [] }, action) => {
  switch (action.type) {
    case FILTER_TAGS:
      return { ...state, filter: action.filter };
    default:
      return state;
  }
};

export default tags;
