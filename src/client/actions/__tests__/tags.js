import should from 'should';
import reducer from '../../reducers';
import { configureStore } from './utils';
import { FILTER_TAGS, filterTags } from '../tags';

describe('Action:tags', () => {
  it('Should change the filter', done => {
    const FILTER = 'filter';
    const hook = {
      [FILTER_TAGS]: getState => {
        const { tags } = getState();
        should(tags.filter).eql(FILTER);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(filterTags(FILTER));
  });
});
