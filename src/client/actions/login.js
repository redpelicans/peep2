import { loadCompanies } from './companies';
import { loadPeople } from './people';
import { loadNotes } from './notes';

export const LOGIN_REQUEST = 'EvtX:Server:auth:login';
export const CHECK_TOKEN = 'EvtX:Server:auth:checkToken';
export const USER_LOGGED = 'auth:logged';
export const USER_LOGOUT = 'EvtX:Server:auth:logout';
export const USER_LOGGED_OUT = 'auth:logout';
export const loginRequest = ({ email, idToken }) => ({
  type: LOGIN_REQUEST,
  replyTo: USER_LOGGED,
  payload: { email, idToken },
});

export const checkToken = (callback) => ({
  type: CHECK_TOKEN,
  callback,
});

export const userLogged = (user, token) => (dispatch) => {
  dispatch({ type: USER_LOGGED, payload: { user, token } });
  dispatch(loadCompanies());
  dispatch(loadPeople());
  dispatch(loadNotes());
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('peepToken');
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_LOGGED_OUT });
};
