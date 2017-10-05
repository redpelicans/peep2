import sinon from 'sinon';
import { events } from '../events';
import { Event } from '../../models';

const data = {
  collections: {
    events: [{ _id: '1', groupId: '1' }, { _id: '2' }, { _id: '3' }],
  },
};

const eventStub = sinon
  .stub(Event, 'findAll')
  .callsFake(() => Promise.resolve(data.collections.events));

afterAll(() => {
  eventStub.restore();
});

describe('Events service', () => {
  test('expect load', () => {
    events
      .load()
      .then(events => expect(events).toEqual(data.collections.events));
  });
});
