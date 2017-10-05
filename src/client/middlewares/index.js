import { is } from 'ramda';
import { goBack } from '../history';
import { USER_LOGGED, logout, userLogged } from '../actions/login';
import { EVTX_ERROR } from '../actions/message';

export const socketIoMiddleWare = socket => ({ dispatch, getState }) => {
  socket.on('action', action => {
    if (!action || !action.type) return;
    switch (action.type) {
      case USER_LOGGED: {
        const { payload: { user, token } } = action;
        dispatch(userLogged(user, token));
        return goBack();
      }
      case EVTX_ERROR:
        switch (action.code) {
          case 403:
          case 401:
            return dispatch(logout());
          default:
            return dispatch(action);
        }
      default:
        return dispatch(action);
    }
  });
  return next => action => {
    if (
      action.type &&
      action.type.toLowerCase().indexOf('evtx:server:') === 0
    ) {
      const { login } = getState();
      const message = {
        ...action,
        type: action.type.slice(12),
        token: login.token,
      };
      const params = ['action', message];
      const { callback } = action;
      if (callback && is(Function, callback)) params.push(callback);
      socket.emit(...params);
    }
    return next(action);
  };
};
