import { SETLOCALE } from '../actions/intl';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SETLOCALE:
      return {
        ...state,
        locale: action.locale,
      };
    default:
      return state;
  }
};

export default reducer;
