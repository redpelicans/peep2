import should from 'should';
import MockedSocket from 'socket.io-mock';
import { socketIoMiddleWare } from '../../middlewares';
import reducer from '../../reducers';
import { configureStore } from './utils';
import {
  loadEvents,
  minValue,
  maxValue,
  addEventGroup,
  delEventGroup,
  EVENTS_ADDED,
  EVENTS_LOADED,
  EVENTS_DELETED,
} from '../events';

describe('Action:events', () => {
  it('Should not delete 1 event group', done => {
    const socket = new MockedSocket();
    const DATA = [];
    const hook = {
      [EVENTS_DELETED]: getState => {
        const { events: { data } } = getState();
        data.should.have.size(0);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook, [
      socketIoMiddleWare(socket.socketClient),
    ]);
    socket.on('action', action => {
      socket.emit('action', {
        type: action.replyTo,
        payload: DATA,
      });
    });
    store.dispatch(delEventGroup(DATA));
  });
  it('Should add 2 event group', done => {
    const socket = new MockedSocket();
    const DATA = [
      { _id: 1, from: 'test', to: 'test' },
      { _id: 2, from: 'test', to: 'test' },
    ];
    const hook = {
      [EVENTS_ADDED]: getState => {
        const { events: { data } } = getState();
        data.should.have.size(2);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook, [
      socketIoMiddleWare(socket.socketClient),
    ]);
    socket.on('action', action => {
      socket.emit('action', {
        type: action.replyTo,
        payload: DATA,
      });
    });
    store.dispatch(addEventGroup(DATA));
  });
  it('Should not add event group ', done => {
    const socket = new MockedSocket();
    const DATA = [];
    const hook = {
      [EVENTS_ADDED]: getState => {
        const { events: { data } } = getState();
        data.should.have.size(0);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook, [
      socketIoMiddleWare(socket.socketClient),
    ]);
    socket.on('action', action => {
      socket.emit('action', {
        type: action.replyTo,
        payload: DATA,
      });
    });
    store.dispatch(addEventGroup(DATA));
  });
  it('Should load events', done => {
    const socket = new MockedSocket();
    const DATA = [
      { _id: 1, from: 'test', to: 'test' },
      { _id: 2, from: 'test', to: 'test' },
    ];
    const hook = {
      [EVENTS_LOADED]: getState => {
        const { events: { data } } = getState();
        data.should.have.size(2);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook, [
      socketIoMiddleWare(socket.socketClient),
    ]);
    socket.on('action', action => {
      socket.emit('action', {
        type: action.replyTo,
        payload: DATA,
      });
    });
    store.dispatch(loadEvents(DATA));
  });
  it('Should minValue return b if a does not exists', () => {
    const a = undefined;
    const b = 5;
    const expected = b;
    const payload = minValue(a, b);
    should(payload).eql(expected);
  });
  it('Should minValue return a equal to 3', () => {
    const a = 3;
    const b = 5;
    const expected = a;
    const payload = minValue(a, b);
    should(payload).eql(expected);
  });
  it('Should minValue return b in case of equality', () => {
    const a = 5;
    const b = 5;
    const expected = b;
    const payload = minValue(a, b);
    should(payload).eql(expected);
  });
  it('Should minValue return a with negative values', () => {
    const a = -8;
    const b = -5;
    const expected = a;
    const payload = minValue(a, b);
    should(payload).eql(expected);
  });
  it('Should maxValue return b if a does not exists', () => {
    const a = undefined;
    const b = 5;
    const expected = b;
    const payload = maxValue(a, b);
    should(payload).eql(expected);
  });
  it('Should maxValue return b equal to 5', () => {
    const a = 3;
    const b = 5;
    const expected = b;
    const payload = maxValue(a, b);
    should(payload).eql(expected);
  });
  it('Should maxValue return a in case of equality', () => {
    const a = 5;
    const b = 5;
    const expected = a;
    const payload = maxValue(a, b);
    should(payload).eql(expected);
  });
  it('Should maxValue return b with negative values', () => {
    const a = -8;
    const b = -5;
    const expected = b;
    const payload = maxValue(a, b);
    should(payload).eql(expected);
  });
  it('Should load events', done => {
    const socket = new MockedSocket();
    const DATA = [
      { _id: 1, from: 'test', to: 'test' },
      { _id: 2, from: 'test', to: 'test' },
    ];
    const hook = {
      [EVENTS_LOADED]: getState => {
        const { events: { data } } = getState();
        data.should.have.size(2);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook, [
      socketIoMiddleWare(socket.socketClient),
    ]);
    socket.on('action', action => {
      socket.emit('action', {
        type: action.replyTo,
        payload: DATA,
      });
    });
    store.dispatch(loadEvents(DATA));
  });
});
