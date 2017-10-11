import should from 'should';
import MockedSocket from 'socket.io-mock';
import { socketIoMiddleWare } from '../../middlewares';
import reducer from '../../reducers';
import { configureStore } from '../utils';
import {
  filterCompanyList,
  sortCompanyList,
  loadCompanies,
  addCompany,
  updateCompany,
  COMPANY_UPDATED,
  COMPANY_ADDED,
  SORT_COMPANY_LIST,
  FILTER_COMPANY_LIST,
  COMPANIES_LOADED,
} from '../companies';

describe('Action:companies', () => {
  it('Should load companies', done => {
    const socket = new MockedSocket();
    const DATA = [{ _id: 1 }, { _id: 2 }];
    const hook = {
      [COMPANIES_LOADED]: getState => {
        const { companies: { data } } = getState();
        should(data).eql(data);
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
    store.dispatch(loadCompanies());
  });

  it('Should add a company', done => {
    const socket = new MockedSocket();
    const _id = 123;
    const name = 'test';
    const DATA = { _id, name };
    const hook = {
      [COMPANY_ADDED]: getState => {
        const { companies: { data } } = getState();
        should(data[_id].name).eql(name);
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
    store.dispatch(addCompany());
  });
  it('Should update a company', done => {
    const socket = new MockedSocket();
    const _id = 123;
    const name = 'test';
    const DATA = { _id, name };
    const hook = {
      [COMPANY_UPDATED]: getState => {
        const { companies: { data } } = getState();
        should(data[_id].name).eql(name);
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
    store.dispatch(updateCompany());
  });
  it('Should update a company', done => {
    const socket = new MockedSocket();
    const _id = 123;
    const name = 'test';
    const DATA = { _id, name };
    const hook = {
      [COMPANY_UPDATED]: getState => {
        const { companies: { data } } = getState();
        should(data[_id].name).eql(name);
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
    store.dispatch(updateCompany());
  });

  it('Should change the filter', done => {
    const FILTER = 'filter';
    const hook = {
      [FILTER_COMPANY_LIST]: getState => {
        const { companies } = getState();
        should(companies.filter).eql(FILTER);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(filterCompanyList(FILTER));
  });
  it('Should change the sortBy to name', done => {
    const NAME = 'name';
    const hook = {
      [SORT_COMPANY_LIST]: getState => {
        const { companies } = getState();
        should(companies.sort.by).eql(NAME);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(sortCompanyList(NAME));
  });
  it('Order should be eql to asc', done => {
    const NAME = 'name';
    const ASC = 'asc';
    const hook = {
      [SORT_COMPANY_LIST]: getState => {
        const { companies } = getState();
        should(companies.sort.order).eql(ASC);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(sortCompanyList(NAME));
  });
  it('Order should be eql to desc', done => {
    const NAME = 'name';
    const DESC = 'desc';
    let count = 0;
    const hook = {
      [SORT_COMPANY_LIST]: getState => {
        const { companies } = getState();
        count++;
        if (count === 2) {
          should(companies.sort.order).eql(DESC);
          done();
        }
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(sortCompanyList(NAME));
    store.dispatch(sortCompanyList(NAME));
  });
});
