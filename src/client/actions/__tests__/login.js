import should from 'should';
import MockedSocket from 'socket.io-mock';
global.window = {};
import localStorage from 'mock-local-storage'; //eslint-disable-line no-unused-vars
window.localStorage = global.localStorage;
import { socketIoMiddleWare } from '../../middlewares';
import reducer from '../../reducers';
import { configureStore } from '../utils';
import { loginRequest, LOGIN_REQUEST, USER_LOGGED } from '../login';

describe('Action:login', () => {
  it('Should get logged', done => {
    const socket = new MockedSocket();
    const USER = { _id: 1 };
    const TOKEN = 'token';
    const DATA = { email: 'test', idToken: 'test' };
    const DATA2 = { user: USER, token: TOKEN };
    const hook = {
      [USER_LOGGED]: getState => {
        const { login: { user, token } } = getState();
        should(user).eql(USER);
        should(token).eql(TOKEN);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook, [
      socketIoMiddleWare(socket.socketClient),
    ]);
    socket.on('action', action => {
      if (action.type === 'auth:login') {
        socket.emit('action', {
          type: action.replyTo,
          payload: DATA2,
        });
      }
    });
    store.dispatch(loginRequest(DATA));
  });
});
