import should from 'should';
import { compose, map, fromPairs } from 'ramda';
import MockedSocket from 'socket.io-mock';
import reducer from '../../reducers';
import { configureStore } from '../utils';
import { socketIoMiddleWare } from '../../middlewares';
import { loadCalendar, CALENDAR_LOADED, LOAD_CALENDAR } from '../calendar';

describe('Action:calendar', () => {
  it('Should calendar be empty', done => {
    const hook = {
      [LOAD_CALENDAR]: getState => {
        const { calendar } = getState();
        calendar.data.should.be.empty();
        done();
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(loadCalendar());
  });

  it('Should load calendar', done => {
    const socket = new MockedSocket();
    const CALENDAR = [['010117', 'Hello']];
    const hook = {
      [CALENDAR_LOADED]: getState => {
        const { calendar } = getState();
        expect(calendar).toEqual(
          compose(map(label => ({ label })), fromPairs)(CALENDAR),
        );
        done();
      },
    };
    const store = configureStore(reducer, {}, hook, [
      socketIoMiddleWare(socket.socketClient),
    ]);
    socket.on('action', action => {
      socket.emit('action', {
        type: action.replyTo,
        payload: CALENDAR,
      });
    });
    store.dispatch(loadCalendar());
  });
});
