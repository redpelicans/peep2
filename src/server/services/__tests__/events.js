import sinon from 'sinon';
import R from 'ramda';
import { ObjectId } from 'mongobless';
import evtX from 'evtx';
import initEvents from '../events';
import { events } from '../events';
import { Event } from '../../models';
import params from '../../../../params';
import { manageError, connect, close, drop } from '../../utils/tests';

const data = {
  collections: {
    events: [{ _id: '1', groupId: '1' }, { _id: '2' }, { _id: '3' }],
  },
};

const evtx = evtX().configure(initEvents);
const service = evtx.service('events');

let db;
beforeAll(() => connect(params.db).then(ctx => (db = ctx)));
afterAll(close);

afterAll(() => {
  eventStub.restore();
});

describe('Events service', () => {
  beforeEach(() => drop(db));

  test('expect load', () => {
    const eventStub = sinon
      .stub(Event, 'findAll')
      .callsFake(() => Promise.resolve(data.collections.events));
    const end = e => {
      eventStub.restore();
      manageError(e);
    };
    const user = { _id: 0 };
    return service
      .load({}, { user })
      .then(events => {
        expect(events.map(n => n.content)).toEqual(
          data.collections.events.map(n => n.content),
        );
        end();
      })
      .catch(end);
  });

  test('expect add will emit events:added', done => {
    const newObj = {
      from: new Date(),
      to: new Date(),
      status: 'TBV',
      type: 'vacation',
      workerId: new ObjectId(),
      events: [
        {
          from: new Date(),
          to: new Date(),
          value: 1,
          period: 'DAY',
        },
      ],
      description: 'description',
    };
    const user = { _id: 0 };
    const check = res => {
      expect(res.length).toEqual(1);
      expect(res[0]).toHaveProperty('groupId');
      expect(R.omit(['_id', 'groupId', 'constructor'], res[0])).toEqual({
        description: newObj.description,
        from: newObj.from,
        to: newObj.to,
        type: newObj.type,
        status: newObj.status,
        workerId: newObj.workerId,
        value: newObj.events[0].value,
        period: newObj.events[0].period,
      });
    };

    evtx.service('events').once('events:added', ({ output: res }) => {
      expect(res.length).toEqual(1);
      expect(res[0]).toHaveProperty('groupId');
      expect(R.omit(['_id', 'groupId', 'constructor'], res[0])).toEqual({
        description: newObj.description,
        from: newObj.events[0].from,
        to: newObj.events[0].to,
        type: newObj.type,
        status: newObj.status,
        workerId: newObj.workerId,
        value: newObj.events[0].value,
        period: newObj.events[0].period,
      });
      done();
    });

    service.addEventGroup(newObj, { user }).catch(done.fail);
  });

  test('expect add', () => {
    const newObj = {
      from: new Date(),
      to: new Date(),
      status: 'TBV',
      type: 'vacation',
      workerId: new ObjectId(),
      events: [
        {
          from: new Date(),
          to: new Date(),
          value: 1,
          period: 'DAY',
        },
      ],
      description: 'description',
    };
    const user = { _id: 0 };
    const check = res => {
      expect(res.length).toEqual(1);
      expect(res[0]).toHaveProperty('groupId');
      expect(R.omit(['_id', 'groupId', 'constructor'], res[0])).toEqual({
        description: newObj.description,
        from: newObj.events[0].from,
        to: newObj.events[0].to,
        type: newObj.type,
        status: newObj.status,
        workerId: newObj.workerId,
        value: newObj.events[0].value,
        period: newObj.events[0].period,
      });
    };

    return service
      .addEventGroup(newObj, { user })
      .then(check)
      .catch(manageError);
  });

  test('expect update', () => {
    const newObj = {
      from: new Date(),
      to: new Date(),
      status: 'TBV',
      type: 'vacation',
      workerId: new ObjectId(),
      events: [
        {
          from: new Date(),
          to: new Date(),
          value: 1,
          period: 'DAY',
        },
      ],
      description: 'description',
    };

    const updates = {
      from: new Date(),
      to: new Date(),
      status: 'V',
      type: 'sickLeaveDay',
      workerId: new ObjectId(),
      events: [
        {
          from: new Date(),
          to: new Date(),
          value: 1,
          period: 'DAY',
        },
        {
          from: new Date(),
          to: new Date(),
          value: 0.5,
          period: 'PM',
        },
      ],
      description: 'new description',
    };

    const user = { _id: 0 };
    const check = res => {
      expect(res.length).toEqual(2);
    };

    return service
      .addEventGroup(newObj, { user })
      .then(o =>
        service.updateEventGroup(
          { groupId: o[0].groupId, ...updates },
          { user },
        ),
      )
      .then(check)
      .catch(manageError);
  });

  test('expect update will emit events:updated', done => {
    const newObj = {
      from: new Date(),
      to: new Date(),
      status: 'TBV',
      type: 'vacation',
      workerId: new ObjectId(),
      events: [
        {
          from: new Date(),
          to: new Date(),
          value: 1,
          period: 'DAY',
        },
      ],
      description: 'description',
    };

    const updates = {
      from: new Date(),
      to: new Date(),
      status: 'V',
      type: 'sickLeaveDay',
      workerId: new ObjectId(),
      events: [
        {
          from: new Date(),
          to: new Date(),
          value: 1,
          period: 'DAY',
        },
        {
          from: new Date(),
          to: new Date(),
          value: 0.5,
          period: 'PM',
        },
      ],
      description: 'new description',
    };

    const user = { _id: 0 };
    const check = res => {
      expect(res.length).toEqual(2);
    };

    let count = 0;

    const callback = ({ output: res }) => {
      count += 1;
      if (count === 2) {
        expect(res.length).toEqual(2);
        expect(res[0].groupId).toEqual(res[1].groupId);
        expect(R.map(R.prop('period'), res)).toEqual(['DAY', 'PM']);
        evtx.service('events').removeAllListeners();
        done();
      }
    };

    evtx.service('events').on('events:added', callback);

    service
      .addEventGroup(newObj, { user })
      .then(o =>
        service.updateEventGroup(
          { groupId: o[0].groupId, ...updates },
          { user },
        ),
      )
      .catch(done.fail);
  });

  test('expect delete', () => {
    const newObj = {
      from: new Date(),
      to: new Date(),
      status: 'TBV',
      type: 'vacation',
      workerId: new ObjectId(),
      events: [
        {
          from: new Date(),
          to: new Date(),
          value: 1,
          period: 'DAY',
        },
      ],
      description: 'description',
    };
    const user = { _id: 0 };
    const check = res => {
      expect(res.length).toEqual(0);
    };

    return service
      .addEventGroup(newObj, { user })
      .then(o => {
        return service
          .delEventGroup({ groupId: o[0].groupId }, { user })
          .then(() => service.load({}, { user }).then(check));
      })
      .catch(manageError);
  });
});
