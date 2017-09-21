import R from 'ramda';
import sinon from 'sinon';
import { ObjectId } from 'mongobless';
import params from '../../../../params';
import Note from '../../models/notes';
import evtX from 'evtx';
import initNotes from '../notes';
import { connect, close, drop } from '../../utils/tests';

const evtx = evtX().configure(initNotes);
const service = evtx.service('notes');
const data = {
  collections: {
    notes: [
      {
        _id: 1,
        content: 'content1',
        entityType: 'company',
      },
      {
        _id: 2,
        content: 'content2',
        entityType: 'company',
        assigneesIds: [0],
      },
      {
        _id: 3,
        content: 'content3',
        entityType: 'company',
        isDeleted: true,
      },
    ],
  },
};

let db;
beforeAll(() => connect(params.db).then(ctx => (db = ctx)));
afterAll(close);

describe('Notes service', () => {
  beforeEach(() => drop(db));

  it('expect load', done => {
    const noteStub = sinon.stub(Note, 'findAll').callsFake(() => Promise.resolve(data.collections.notes));
    const end = (...params) => {
      noteStub.restore();
      done(...params);
    };
    const user = { _id: 0 };
    service
      .load(null, { user })
      .then(notes => {
        expect(notes.map(n => n.content)).toEqual(data.collections.notes.map(n => n.content));
        end();
      })
      .catch(end);
  });

  it('expect add', done => {
    const newObj = {
      content: 'content',
      entityType: 'company',
      entityId: ObjectId(),
      assigneesIds: [1, 2],
      notification: true,
      status: 'done',
    };
    const user = { _id: 0 };
    const checkObj = obj => {
      const res = {
        content: 'content',
        authorId: user._id,
        entityType: 'company',
        assigneesIds: [1, 2],
        notification: true,
        status: 'done',
      };
      expect(R.omit(['_id', 'entityId', 'createdAt', 'constructor'], obj)).toEqual(res);
      return obj;
    };
    service
      .add(newObj, { user })
      .then(checkObj)
      .then(() => done())
      .catch(done);
  });

  it('expect update', done => {
    const newObj = {
      content: 'content',
      entityType: 'company',
      entityId: ObjectId(),
      assigneesIds: [1, 2],
      notification: true,
      status: 'done',
    };
    const updates = {
      content: 'content2',
      entityId: newObj.entityId,
      entityType: 'company',
      assigneesIds: [1, 2, 3],
      status: 'already done',
    };

    const user = { _id: 0 };
    const checkObj = obj => {
      const res = {
        authorId: user._id,
        content: 'content2',
        entityType: 'company',
        assigneesIds: [1, 2, 3],
        notification: true,
        status: 'already done',
      };
      expect(R.omit(['_id', 'entityId', 'updatedAt', 'constructor'], obj)).toEqual(res);
      expect(obj.entityId.toString()).toEqual(newObj.entityId.toString());
      return obj;
    };

    service
      .add(newObj, { user })
      .then(o => service.update({ _id: o._id, ...updates }, { user }))
      .then(checkObj)
      .then(() => done())
      .catch(done);
  });
});
