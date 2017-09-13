import should from 'should';
import mongobless from 'mongobless';
import config from '../../../../config';
import { Note } from '..';
import { connect, close, drop, load } from './utils';

const data = {
  collections:{
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

    ]
  }
};

describe('Note models', function() {
  before(() => connect(this));
  beforeEach(() => drop(this).then(() => load(this, data)));
  after(close);

  it('should find all', (done) => {
    Note
      .loadAll()
      .then( notes => {
        const contents = notes.map(note => note.content).join('');
        const res = data.collections.notes
          .filter(note => !note.isDeleted)
          .map(note => note.content).join('');
        should(contents).equal(res);
        done();
    })
    .catch(done);
  });

  it('should load all', (done) => {
    Note
      .loadAll({ content: 'content1' })
      .then( notes => {
        const names = notes.map(note => note.content).join('');
        should(names).equal('content1');
        done();
    })
    .catch(done);
  });


  it('should load one', (done) => {
    const { _id, content } = data.collections.notes[0];
    Note
      .loadOne(_id)
      .then( note => {
        should(note._id).equal(_id);
        should(note.content).equal(content);
        done();
    })
    .catch(done);
  });

 
  it('should find one', (done) => {
    const content = data.collections.notes[0].content;
    Note
      .findOne({ content })
      .then( note => {
        should(note.content).equal(content);
        done();
    })
    .catch(done);
  });

});


