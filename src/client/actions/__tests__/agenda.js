import should from 'should';
import reducer from '../../reducers';
import { configureStore } from './utils';
import { DATE_CHANGE, changeDate } from '../agenda';

describe('Action:agenda', () => {
  it('Should change the date', done => {
    const DATE = 'date';
    const hook = {
      [DATE_CHANGE]: getState => {
        const { agenda } = getState();
        should(agenda.date).eql(DATE);
        done();
      },
    };
    const store = configureStore(reducer, {}, hook);
    store.dispatch(changeDate(DATE));
  });
});
