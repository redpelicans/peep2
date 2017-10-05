import should from 'should';
import reducer from '../../reducers';
import { configureStore } from './utils';
import {
  filterCompanyList,
  sortCompanyList,
  SORT_COMPANY_LIST,
  FILTER_COMPANY_LIST,
} from '../companies';

describe('Action:companies', () => {
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
