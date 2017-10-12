import should from 'should';
import MockedSocket from 'socket.io-mock';
import localStorage from 'mock-local-storage';
import { socketIoMiddleWare } from '../../middlewares';
import reducer from '../../reducers';
import { configureStore } from '../utils';
import { loginRequest, USER_LOGGED } from '../login';

global.window = {};
window.localStorage = global.localStorage;

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
      socket.emit('action', {
        type: action.replyTo,
        payload: DATA2,
      });
    });
    store.dispatch(loginRequest(DATA));
  });
});
