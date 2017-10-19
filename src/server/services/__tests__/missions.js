import R from 'ramda';
import sinon from 'sinon';
import { ObjectId } from 'mongobless';
import params from '../../../../params';
import Mission from '../../models/missions';
import evtX from 'evtx';
import initMissions from '../missions';
import { connect, close, drop } from '../../utils/tests';

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
        timesheetUnit: 'hours',
        allowWeekends: true,
        assigneesIds: [new ObjectId(), new ObjectId()],
      },
    ],
  },
};

let db;
beforeAll(() => connect(params.db).then(ctx => (db = ctx)));
afterAll(close);

const manageError = e => {
  if (e) throw e.error || e;
};

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
      billedTarget: 'client',
      timesheetUnit: 'hours',
      allowWeekends: true,
      assigneesIds: [new ObjectId(), new ObjectId()],
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
});
