import should from 'should';
import reducer from '../../reducers';
import { configureStore } from './utils';
import {
  onTagClick,
  sortPeopleList,
  SORT_PEOPLE_LIST,
  FILTER_PEOPLE_LIST,
} from '../people';

const { describe, it } = global;

describe('Action:people', () => {
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
});
