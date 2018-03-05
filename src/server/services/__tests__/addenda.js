import R from 'ramda';
import sinon from 'sinon';
import { ObjectId } from 'mongobless';
import params from '../../../../params';
import evtX from 'evtx';
import initAddenda from '../addenda';
import Addenda from '../../models/addenda';
import { manageFail, manageError, connect, close } from '../../utils/tests';

const evtx = evtX().configure(initAddenda);
const service = evtx.service('addenda');
const user = { _id: 0 };
const data = {
  collections: {
    addenda: [
      {
        _id: 1,
        missionId: new ObjectId(),
        workerId: new ObjectId(),
        startDate: new Date(2018, 1, 1),
        endDate: new Date(2020, 1, 1),
        fees: {
          currency: 'EUR',
          amount: 100,
          unit: 'day',
        },
      },
    ],
  },
};

let db;
beforeAll(() => connect(params.db).then(ctx => (db = ctx)));
afterAll(close);

describe('Addenda service', () => {
  test('expect load', () => {
    const addendumStub = sinon
      .stub(Addenda, 'findAll')
      .callsFake(() => Promise.resolve(data.collections.addenda));
    const end = e => {
      addendumStub.restore();
      manageError(e);
    };
    const user = { _id: 0 };
    return service
      .load(null, { user })
      .then(addenda => {
        expect(addenda.map(n => n.content)).toEqual(
          data.collections.addenda.map(n => n.content),
        );
        end();
      })
      .catch(end);
  });

  test('expect add', () => {
    const newObj = {
      workerId: new ObjectId(),
      missionId: new ObjectId(),
      startDate: new Date(),
      fees: { currency: 'EUR', unit: 'day', amount: 100 },
    };

    const checkObj = obj => {
      expect(newObj).toEqual(R.omit(['_id', 'createdAt', 'constructor'], obj));
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
      expect(R.omit(['_id', 'createdAt', 'constructor'], addenda)).toEqual(
        newObj,
      );
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
      expect(updates).toEqual(
        R.omit(['_id', 'createdAt', 'updatedAt', 'constructor'], obj),
      );
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
      expect(
        R.omit(['_id', 'createdAt', 'updatedAt', 'constructor'], addenda),
      ).toEqual(updates);
      done();
    });

    service
      .add(newObj, { user })
      .then(obj => service.update({ _id: obj._id, ...updates }, { user }))
      .catch(manageFail(done));
  });

  test('expect delete', () => {
    const newObj = {
      workerId: new ObjectId(),
      missionId: new ObjectId(),
      startDate: new Date(),
      fees: { currency: 'EUR', unit: 'day', amount: 100 },
    };

    const checkObj = obj => {
      expect(obj).toEqual({ _id: obj._id });
    };

    return service
      .add(newObj, { user })
      .then(obj => service.del({ _id: obj._id }, { user }))
      .then(checkObj)
      .catch(manageError);
  });

  it('expect delete will emit addendum:deleted', done => {
    const newObj = {
      workerId: new ObjectId(),
      missionId: new ObjectId(),
      startDate: new Date(),
      fees: { currency: 'EUR', unit: 'day', amount: 100 },
    };

    service
      .add(newObj, { user })
      .then(obj => {
        evtx.service('addenda').once('addendum:deleted', ({ output: obj }) => {
          expect(obj._id).toEqual(obj._id);
          done();
        });
        return service.del({ _id: obj._id }, { user });
      })
      .catch(manageFail(done));
  });
});
