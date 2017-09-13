import R from 'ramda';
import { USER_LOGOUT, USER_LOGGED } from '../actions/login';

const login = (state = {}, action) => {
  const { type } = action;
  switch (type) {
    case USER_LOGOUT:
      return R.omit(['user', 'token'], state);
    case USER_LOGGED:
      const { payload: { user, token } } = action;
      return { ...state, user, token };
    default:
      return state;
  }
};

export default login;
