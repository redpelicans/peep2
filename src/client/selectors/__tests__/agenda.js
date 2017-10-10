import should from 'should';
import { getCurrentDate } from '../agenda';

describe('Selectors:agenda', () => {
  it('Should get an empty current date', () => {
    const state = {
      agenda: {
        date: {},
      },
    };
    const date = getCurrentDate(state);
    date.should.be.empty();
  });
  it('Should get a current date', () => {
    const test = 'test';
    const state = {
      agenda: {
        date: test,
      },
    };
    const date = getCurrentDate(state);
    should(date).eql(test);
  });
});
