import R from 'ramda';
import sinon from 'sinon';
import { ObjectId } from 'mongobless';
import params from '../../../../params';
import Mission from '../../models/missions';
import evtX from 'evtx';
import initMissions from '../missions';
import { manageError, connect, close, drop } from '../../utils/tests';

const evtx = evtX().configure(initMissions);
const service = evtx.service('missions');
const data = {
  collections: {
    missions: [
      {
        _id: 1,
        clientId: new ObjectId(),
        partnerId: new ObjectId(),
        managerId: new ObjectId(),
        name: 'name',
        startDate: new Date(),
        endDate: new Date(),
        billedTarget: 'client',
        timesheetUnit: 'hour',
        allowWeekends: true,
        workerIds: [new ObjectId(), new ObjectId()],
      },
    ],
  },
};

let db;
beforeAll(() => connect(params.db).then(ctx => (db = ctx)));
afterAll(close);

describe('Missions service', () => {
  beforeEach(() => drop(db));

  test('expect load', () => {
    const missionStub = sinon
      .stub(Mission, 'findAll')
      .callsFake(() => Promise.resolve(data.collections.missions));
    const end = e => {
      missionStub.restore();
      manageError(e);
    };
    const user = { _id: 0 };
    return service
      .load(null, { user })
      .then(missions => {
        expect(missions.map(n => n.content)).toEqual(
          data.collections.missions.map(n => n.content),
        );
        end();
      })
      .catch(end);
  });

  test('expect add', () => {
    const newObj = {
      note: 'note',
      clientId: new ObjectId(),
      partnerId: new ObjectId(),
      managerId: new ObjectId(),
      name: 'name',
      startDate: new Date(),
      endDate: new Date(),
      billedTarget: 'partner',
      timesheetUnit: 'day',
      allowWeekends: false,
      workerIds: [new ObjectId(), new ObjectId()],
    };
    const user = { _id: 0 };
    const checkObj = obj => {
      expect(R.omit(['_id', 'createdAt', 'constructor'], obj)).toEqual(
        R.omit(['note'], newObj),
      );
    };

    return service
      .add(newObj, { user })
      .then(checkObj)
      .catch(manageError);
  });

  test('expect add will emit mission:added', done => {
    const newObj = {
      note: 'note',
      clientId: new ObjectId(),
      partnerId: new ObjectId(),
      managerId: new ObjectId(),
      name: 'name',
      startDate: new Date(),
      endDate: new Date(),
      billedTarget: 'client',
      timesheetUnit: 'hour',
      allowWeekends: true,
      workerIds: [new ObjectId(), new ObjectId()],
    };
    const user = { _id: 0 };

    evtx.service('missions').once('mission:added', ({ output: mission }) => {
      expect(R.omit(['_id', 'createdAt', 'constructor'], mission)).toEqual(
        R.omit(['note'], newObj),
      );
      done();
    });

    service.add(newObj, { user }).catch(done.fail);
  });

  test('expect update', () => {
    const newObj = {
      clientId: new ObjectId(),
      partnerId: new ObjectId(),
      managerId: new ObjectId(),
      name: 'name',
      startDate: new Date(),
      endDate: new Date(),
      billedTarget: 'client',
      timesheetUnit: 'hour',
      allowWeekends: true,
      workerIds: [new ObjectId(), new ObjectId()],
    };
    const updates = {
      clientId: new ObjectId(),
      partnerId: new ObjectId(),
      managerId: new ObjectId(),
      name: 'new name',
      startDate: new Date(),
      endDate: new Date(),
      billedTarget: 'partner',
      timesheetUnit: 'day',
      allowWeekends: false,
      workerIds: [new ObjectId(), new ObjectId()],
    };
    const user = { _id: 0 };
    const checkObj = obj => {
      expect(
        R.omit(['_id', 'createdAt', 'updatedAt', 'constructor'], obj),
      ).toEqual(R.omit(['_id'], { ...newObj, ...updates }));
    };

    return service
      .add(newObj, { user })
      .then(o => service.update({ _id: o._id, ...updates }, { user }))
      .then(checkObj)
      .catch(manageError);
  });

  test('expect update will emit mission:updated', done => {
    const newObj = {
      clientId: new ObjectId(),
      partnerId: new ObjectId(),
      managerId: new ObjectId(),
      name: 'name',
      startDate: new Date(),
      endDate: new Date(),
      billedTarget: 'client',
      timesheetUnit: 'hour',
      allowWeekends: true,
      workerIds: [new ObjectId(), new ObjectId()],
    };
    const updates = {
      clientId: new ObjectId(),
      partnerId: new ObjectId(),
      managerId: new ObjectId(),
      name: 'new name',
      startDate: new Date(),
      endDate: new Date(),
      billedTarget: 'partner',
      timesheetUnit: 'day',
      allowWeekends: false,
      workerIds: [new ObjectId(), new ObjectId()],
    };
    const user = { _id: 0 };

    evtx.service('missions').once('mission:updated', ({ output: mission }) => {
      expect(
        R.omit(['_id', 'createdAt', 'updatedAt', 'constructor'], mission),
      ).toEqual(R.omit(['_id'], { ...newObj, ...updates }));
      done();
    });

    service
      .add(newObj, { user })
      .then(o => service.update({ _id: o._id, ...updates }, { user }))
      .catch(done.fail);
  });

  test('expect delete', () => {
    const newObj = {
      note: 'note',
      clientId: new ObjectId(),
      partnerId: new ObjectId(),
      managerId: new ObjectId(),
      name: 'name',
      startDate: new Date(),
      endDate: new Date(),
      billedTarget: 'partner',
      timesheetUnit: 'day',
      allowWeekends: false,
      workerIds: [new ObjectId(), new ObjectId()],
    };
    const user = { _id: 0 };
    const check = (o, _id) => res => {
      expect(res.length).toEqual(0);
      expect(o._id).toEqual(_id);
    };

    return service
      .add(newObj, { user })
      .then(o => {
        return service
          .del({ _id: o._id }, { user })
          .then(({ _id }) => service.load({}, { user }).then(check(o, _id)));
      })
      .catch(manageError);
  });
});
