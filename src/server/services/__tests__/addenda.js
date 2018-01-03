import R from 'ramda';
import sinon from 'sinon';
import { ObjectId } from 'mongobless';
import params from '../../../../params';
import Mission from '../../models/missions';
import evtX from 'evtx';
import initAddenda from '../addenda';
import { manageError, manageFail } from '../../utils/tests';

const evtx = evtX().configure(initAddenda);
const service = evtx.service('addenda');
const FAKE_ID = 'A'.repeat(12);
const user = { _id: 0 };

jest.mock('../../models/addenda', () => {
  let count = 0;
  const ID = () =>
    String(count++)
      .repeat(12)
      .slice(0, 12);
  const FAKE_ID = 'A'.repeat(12);
  const DB = {
    addendum: {
      [ID()]: {
        _id: FAKE_ID,
        missionId: FAKE_ID,
        workerId: FAKE_ID,
        startDate: new Date(2018, 1, 1),
        endDate: new Date(2020, 1, 1),
        fees: {
          currency: 'EUR',
          amount: 100,
          unit: 'day',
        },
      },
    },
  };
  return {
    loadAll: () => Promise.resolve(Object.values(DB.addendum)),
    loadOne: id => {
      return Promise.resolve(DB.addendum[id]);
    },
    collection: {
      insertOne: addendum => {
        const newAddendum = { _id: ID(), ...addendum };
        DB.addendum[newAddendum._id] = newAddendum;
        return Promise.resolve({ insertedId: newAddendum._id });
      },
      updateOne: ({ _id }, { $set: updates }) => {
        DB.addendum[_id] = updates;
        return Promise.resolve(updates);
      },
    },
  };
});

describe('Addenda service', () => {
  test('expect load', () => {
    return service
      .load(null, { user })
      .then(missions => {
        expect(missions[0].workerId).toEqual(FAKE_ID);
        manageError();
      })
      .catch(manageError);
  });

  test('expect add', () => {
    const newObj = {
      workerId: new ObjectId(),
      missionId: new ObjectId(),
      startDate: new Date(),
      fees: { currency: 'EUR', unit: 'day', amount: 100 },
    };

    const checkObj = obj => {
      expect(newObj).toEqual(R.omit(['_id', 'createdAt'], obj));
    };

    return service
      .add(newObj, { user })
      .then(checkObj)
      .catch(manageError);
  });

  test('expect add emits addendum:added', done => {
    const newObj = {
      workerId: new ObjectId(),
      missionId: new ObjectId(),
      startDate: new Date(),
      fees: { currency: 'EUR', unit: 'day', amount: 100 },
    };

    evtx.service('addenda').once('addendum:added', ({ output: addenda }) => {
      expect(R.omit(['_id', 'createdAt'], addenda)).toEqual(newObj);
      done();
    });

    service.add(newObj, { user }).catch(manageFail(done));
  });

  test('expect update', () => {
    const newObj = {
      workerId: new ObjectId(),
      missionId: new ObjectId(),
      startDate: new Date(),
      fees: { currency: 'EUR', unit: 'day', amount: 100 },
    };

    const updates = {
      workerId: new ObjectId(),
      missionId: new ObjectId(),
      startDate: new Date(),
      endDate: new Date(),
      fees: { currency: 'EUR', unit: 'day', amount: 200 },
    };

    const checkObj = obj => {
      expect(updates).toEqual(R.omit(['_id', 'createdAt', 'updatedAt'], obj));
    };

    return service
      .add(newObj, { user })
      .then(obj => service.update({ _id: obj._id, ...updates }, { user }))
      .then(checkObj)
      .catch(manageError);
  });

  test('expect update emits addendum:updated', done => {
    const newObj = {
      workerId: new ObjectId(),
      missionId: new ObjectId(),
      startDate: new Date(),
      fees: { currency: 'EUR', unit: 'day', amount: 100 },
    };

    const updates = {
      workerId: new ObjectId(),
      missionId: new ObjectId(),
      startDate: new Date(),
      endDate: new Date(),
      fees: { currency: 'EUR', unit: 'day', amount: 200 },
    };

    evtx.service('addenda').once('addendum:updated', ({ output: addenda }) => {
      expect(R.omit(['_id', 'createdAt', 'updatedAt'], addenda)).toEqual(
        updates,
      );
      done();
    });

    service
      .add(newObj, { user })
      .then(obj => service.update({ _id: obj._id, ...updates }, { user }))
      .catch(manageFail(done));
  });
});
