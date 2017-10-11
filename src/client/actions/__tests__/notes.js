import should from 'should';
import MockedSocket from 'socket.io-mock';
import { socketIoMiddleWare } from '../../middlewares';
import reducer from '../../reducers';
import { configureStore } from './utils';
import {
  filterNotesList,
  sortNotesList,
  loadNotes,
  NOTES_LOADED,
  SORT_NOTES_LIST,
  FILTER_NOTES_LIST,
} from '../notes';

describe('Action:notes', () => {
  it('Should load 2 notes', done => {
    const socket = new MockedSocket();
    const DATA = [{ _id: 1 }, { _id: 2 }];
    const hook = {
      [NOTES_LOADED]: getState => {
        const { notes: { data } } = getState();
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
    store.dispatch(loadNotes(DATA));
  });
  it('Should not load notes', done => {
    const socket = new MockedSocket();
    const DATA = [];
    const hook = {
      [NOTES_LOADED]: getState => {
        const { notes: { data } } = getState();
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
    store.dispatch(loadNotes(DATA));
  });
  it('Should change the filter', done => {
    const FILTER = 'filter';
    const hook = {
      [FILTER_NOTES_LIST]: getState => {
        const { notes } = getState();
        should(notes.filter).eql(FILTER);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(filterNotesList(FILTER));
  });
  it('Should change the sortBy to name', done => {
    const CREATEDAT = 'createdAt';
    const hook = {
      [SORT_NOTES_LIST]: getState => {
        const { notes } = getState();
        should(notes.sort.by).eql(CREATEDAT);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(sortNotesList(CREATEDAT));
  });
  it('Order should be eql to asc', done => {
    const CREATEDAT = 'createdAt';
    const ASC = 'asc';
    const hook = {
      [SORT_NOTES_LIST]: getState => {
        const { notes } = getState();
        should(notes.sort.order).eql(ASC);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(sortNotesList(CREATEDAT));
  });
  it('Order should be eql to desc', done => {
    const CREATEDAT = 'createdAt';
    const DESC = 'desc';
    let count = 0;
    const hook = {
      [SORT_NOTES_LIST]: getState => {
        const { notes } = getState();
        count++;
        if (count === 2) {
          should(notes.sort.order).eql(DESC);
          done();
        }
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(sortNotesList(CREATEDAT));
    store.dispatch(sortNotesList(CREATEDAT));
  });
});
