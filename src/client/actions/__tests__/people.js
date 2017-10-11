import should from 'should';
import MockedSocket from 'socket.io-mock';
import reducer from '../../reducers';
import { configureStore } from '../utils';
import { socketIoMiddleWare } from '../../middlewares';
import {
  loadPeople,
  onTagClick,
  sortPeopleList,
  addPeople,
  updatePeople,
  deletePeople,
  PEOPLE_DELETED,
  PEOPLE_UPDATED,
  PEOPLE_ADDED,
  PEOPLE_LOADED,
  SORT_PEOPLE_LIST,
  FILTER_PEOPLE_LIST,
} from '../people';

describe('Action:people', () => {
  it('Should load people', done => {
    const socket = new MockedSocket();
    const DATA = [{ _id: 1 }, { _id: 2 }, { _id: 3 }];
    const hook = {
      [PEOPLE_LOADED]: getState => {
        const { people: { data } } = getState();
        data.should.have.size(3);
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
    store.dispatch(loadPeople());
  });
  it('Should not load people', done => {
    const socket = new MockedSocket();
    const DATA = [];
    const hook = {
      [PEOPLE_LOADED]: getState => {
        const { people: { data } } = getState();
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
    store.dispatch(loadPeople());
  });
  it('Should add a person', done => {
    const socket = new MockedSocket();
    const _id = 123;
    const expectedFirstname = 'test2';
    const DATA = { _id, firstname: expectedFirstname };
    const hook = {
      [PEOPLE_ADDED]: getState => {
        const { people: { data } } = getState();
        if (data[_id]) {
          const { firstname } = data[_id];
          should(firstname).eql(expectedFirstname);
        }
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
    store.dispatch(addPeople(DATA));
  });
  it('Should update a person', done => {
    const socket = new MockedSocket();
    const _id = 123;
    const expectedFirstname = 'test2';
    const DATA = { _id, firstname: expectedFirstname };
    const hook = {
      [PEOPLE_UPDATED]: getState => {
        const { people: { data } } = getState();
        if (data[_id]) {
          const { firstname } = data[_id];
          should(firstname).eql(expectedFirstname);
        }
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
    store.dispatch(updatePeople(DATA));
  });
  it('Should delete a person', done => {
    const socket = new MockedSocket();
    const _id = 123;
    const expectedFirstname = 'test2';
    const DATA = { _id, firstname: expectedFirstname };
    const hook = {
      [PEOPLE_DELETED]: getState => {
        const { people: { data } } = getState();
        if (data[_id]) {
          const { firstname } = data[_id];
          should(firstname).eql(expectedFirstname);
        }
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
    store.dispatch(deletePeople(DATA));
  });

  it('Should change the filter', done => {
    const FILTER = 'filter';
    const hook = {
      [FILTER_PEOPLE_LIST]: getState => {
        const { people: { filter } } = getState();
        should(filter).eql(FILTER);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(onTagClick(FILTER));
  });
  it('Should change the sortBy to name', done => {
    const NAME = 'name';
    const hook = {
      [SORT_PEOPLE_LIST]: getState => {
        const { people: { sort: { by } } } = getState();
        should(by).eql(NAME);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(sortPeopleList(NAME));
  });
  it('Order should be eql to asc', done => {
    const NAME = 'name';
    const ASC = 'asc';
    const hook = {
      [SORT_PEOPLE_LIST]: getState => {
        const { people: { sort: { order } } } = getState();
        should(order).eql(ASC);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(sortPeopleList(NAME));
  });
  it('Order should be eql to desc', done => {
    const NAME = 'name';
    const DESC = 'desc';
    let count = 0;
    const hook = {
      [SORT_PEOPLE_LIST]: getState => {
        const { people: { sort: { order } } } = getState();
        count++;
        if (count === 2) {
          should(order).eql(DESC);
          done();
        }
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(sortPeopleList(NAME));
    store.dispatch(sortPeopleList(NAME));
  });
});
