import config from '../../../../params';
import { Note } from '..';
import { connect, close, drop, load } from '../../utils/tests';

const data = {
  collections: {
    notes: [
      {
        _id: 1,
        content: 'content1',
        entityType: 'company',
      },
      {
        content: 'content2',
        entityType: 'company',
        assigneesIds: [0],
      },
      {
        content: 'content3',
        entityType: 'company',
        isDeleted: true,
      },

    ],
  },
};

const ctx = {};
beforeAll(() => connect(config.db).then(db => ctx.db = db));
afterAll(close);

describe('Note models', () => {
  beforeEach(() => drop(ctx.db).then(() => load(ctx.db, data)));

  it('expect find all', (done) => {
    Note
      .loadAll()
      .then(notes => {
        const contents = notes.map(note => note.content).join('');
        const res = data.collections.notes
          .filter(note => !note.isDeleted)
          .map(note => note.content).join('');
        expect(contents).toEqual(res);
        done();
      })
      .catch(done);
  });

  it('expect load all', (done) => {
    Note
      .loadAll({ content: 'content1' })
      .then(notes => {
        const names = notes.map(note => note.content).join('');
        expect(names).toEqual('content1');
        done();
      })
      .catch(done);
  });


  it('expect load one', (done) => {
    const { _id, content } = data.collections.notes[0];
    Note
      .loadOne(_id)
      .then(note => {
        expect(note._id).toEqual(_id);
        expect(note.content).toEqual(content);
        done();
      })
      .catch(done);
  });


  it('expect find one', (done) => {
    const content = data.collections.notes[0].content;
    Note
      .findOne({ content })
      .then(note => {
        expect(note.content).toEqual(content);
        done();
      })
      .catch(done);
  });
});

