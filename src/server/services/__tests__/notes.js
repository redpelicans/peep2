import R from 'ramda';
import sinon from 'sinon';
import { ObjectId } from 'mongobless';
import params from '../../../../params';
import { notes } from '../cities';
import Note from '../../models/notes';
import evtX from 'evtx';
import initNotes from '../notes';
import {
  manageFail,
  manageError,
  connect,
  close,
  drop,
} from '../../utils/tests';

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

  it('expect load', () => {
    const noteStub = sinon
      .stub(Note, 'findAll')
      .callsFake(() => Promise.resolve(data.collections.notes));
    const end = e => {
      noteStub.restore();
      manageError(e);
    };
    const user = { _id: 0 };
    return service
      .load(null, { user })
      .then(notes => {
        expect(notes.map(n => n.content)).toEqual(
          data.collections.notes.map(n => n.content),
        );
        end();
      })
      .catch(end);
  });

  it('expect add', () => {
    const newObj = {
      content: 'content',
      entityType: 'company',
      entityId: ObjectId(),
      assigneesIds: [new ObjectId(), new ObjectId()],
    };
    const user = { _id: 0 };
    const checkObj = obj => {
      expect(R.omit(['_id', 'createdAt', 'constructor'], obj)).toEqual({
        authorId: user._id,
        ...newObj,
      });
    };
    return service
      .add(newObj, { user })
      .then(checkObj)
      .catch(manageError);
  });

  it('expect add will emit note:added', done => {
    const newObj = {
      content: 'content',
      entityType: 'company',
      entityId: ObjectId(),
      assigneesIds: [new ObjectId(), new ObjectId()],
    };
    const user = { _id: 0 };

    evtx.service('notes').once('note:added', ({ output: obj }) => {
      expect(R.omit(['_id', 'createdAt', 'constructor'], obj)).toEqual({
        authorId: user._id,
        ...newObj,
      });
      done();
    });

    service.add(newObj, { user }).catch(manageFail(done));
  });

  it('expect update', () => {
    const newObj = {
      content: 'new content',
      entityType: 'company',
      entityId: ObjectId(),
      assigneesIds: [new ObjectId(), new ObjectId()],
    };
    const updates = {
      content: 'content2',
      entityId: newObj.entityId,
      entityType: 'company',
      assigneesIds: [new ObjectId(), new ObjectId(), new ObjectId()],
    };

    const user = { _id: 0 };
    const checkObj = obj => {
      expect(obj.entityId.toString()).toEqual(newObj.entityId.toString());
      expect(obj.assigneesIds.length).toEqual(updates.assigneesIds.length);
      expect(obj.content).toEqual(updates.content);
      return obj;
    };

    return service
      .add(newObj, { user })
      .then(o => service.update({ _id: o._id, ...updates }, { user }))
      .then(checkObj)
      .catch(manageError);
  });

  it('expect update will emit note:updated', done => {
    const newObj = {
      content: 'new content',
      entityType: 'company',
      entityId: ObjectId(),
      assigneesIds: [new ObjectId(), new ObjectId()],
    };
    const updates = {
      content: 'content2',
      entityId: newObj.entityId,
      entityType: 'company',
      assigneesIds: [new ObjectId(), new ObjectId(), new ObjectId()],
    };

    const user = { _id: 0 };

    evtx.service('notes').once('note:updated', ({ output: obj }) => {
      expect(obj.entityId.toString()).toEqual(newObj.entityId.toString());
      expect(obj.assigneesIds.length).toEqual(updates.assigneesIds.length);
      expect(obj.content).toEqual(updates.content);
      done();
    });

    service
      .add(newObj, { user })
      .then(o => service.update({ _id: o._id, ...updates }, { user }))
      .catch(manageFail(done));
  });

  it('expect delete will emit note:deleted', done => {
    const newObj = {
      content: 'content',
      entityType: 'company',
      entityId: ObjectId(),
      assigneesIds: [new ObjectId(), new ObjectId()],
    };
    const user = { _id: 0 };

    service
      .add(newObj, { user })
      .then(note => {
        evtx.service('notes').once('note:deleted', ({ output: obj }) => {
          expect(obj._id).toEqual(note._id);
          done();
        });
        return service.del({ _id: note._id }, { user });
      })
      .catch(manageFail(done));
  });
});
