import should from 'should';
import reducer from '../../reducers';
import { configureStore } from './utils';
import { loadCalendar, LOAD_CALENDAR } from '../calendar';

describe('Action:calendar', () => {
  it('Should', done => {
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
});
