import should from 'should';
import { getEvents, belongsToPeriod } from '../events';

describe('Selectors:events', () => {
  it('Should get an empty events object', () => {
    const state = {
      events: { data: {} },
    };
    const companies = getEvents(state);
    companies.should.be.empty();
  });
  it('Should get a non-empty events object', () => {
    const test = 'test';
    const state = {
      events: { data: { test } },
    };
    const companies = getEvents(state);
    should(companies).eql({ test });
  });
  it('Should belong to period', () => {
    const testedDate = 'Tue Oct 20 2017 00:00:00 GMT+0200 (CEST)';
    const monthDate = 'Tue Oct 17 2017 00:00:00 GMT+0200  (CEST)';
    const data = belongsToPeriod(testedDate, monthDate);
    should(data).eql(true);
  });
  it('Should not belong to period', () => {
    const testedDate = 'Tue Dec 10 2017 00:00:00 GMT+0200 (CEST)';
    const monthDate = 'Tue Oct 17 2017 00:00:00 GMT+0200  (CEST)';
    const data = belongsToPeriod(testedDate, monthDate);
    should(data).eql(false);
  });
});
