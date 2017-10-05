import should from 'should';
import MockedSocket from 'socket.io-mock';
import reducer from '../../reducers';
import { configureStore } from './utils';
import { socketIoMiddleWare } from '../../middlewares';
import {
  loadPeople,
  onTagClick,
  sortPeopleList,
  PEOPLE_LOADED,
  SORT_PEOPLE_LIST,
  FILTER_PEOPLE_LIST,
} from '../people';

describe('Action:people', () => {
  test('Should load people', done => {
    const socket = new MockedSocket();
    const DATA = [{ _id: 1 }, { _id: 2 }];
    const hook = {
      [PEOPLE_LOADED]: getState => {
        const { people: { data } } = getState();
        expect(data).toEqual(data);
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

  it('Should change the filter', done => {
    const FILTER = 'filter';
    const hook = {
      [FILTER_PEOPLE_LIST]: getState => {
        const { people } = getState();
        should(people.filter).eql(FILTER);
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
        const { people } = getState();
        should(people.sort.by).eql(NAME);
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
        const { people } = getState();
        should(people.sort.order).eql(ASC);
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
        const { people } = getState();
        count++;
        if (count === 2) {
          should(people.sort.order).eql(DESC);
          done();
        }
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(sortPeopleList(NAME));
    store.dispatch(sortPeopleList(NAME));
  });
});
