import should from 'should';
import { getCalendar } from '../calendar';

describe('Selectors:calendar', () => {
  it('Should get an empty calendar', () => {
    const state = {
      calendar: {},
    };
    const calendar = getCalendar(state);
    calendar.should.be.empty();
  });
  it('Should get a non-empty calendar', () => {
    const test = 'test';
    const state = {
      calendar: test,
    };
    const calendar = getCalendar(state);
    should(calendar).eql(test);
  });
});
