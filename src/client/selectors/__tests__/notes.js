import should from 'should';
import {
  getFilter,
  getNotes,
  getSort,
  getVisibleNotes,
  regexp,
  doFilter,
  nmatch,
} from '../notes';

describe('Selectors:notes', () => {
  it('Should not get empty notes object', () => {
    const notes = 'test';
    const state = {
      notes: {
        data: notes,
      },
    };
    const notesFromState = getNotes(state);
    should(notesFromState).eql(notes);
  });
  it('Should get empty notes object', () => {
    const state = {
      notes: {},
    };
    const notesFromState = getNotes(state);
    should(notesFromState).eql(undefined);
  });
  it('Should get the filter', () => {
    const filter = 'test';
    const state = {
      notes: {
        filter,
      },
    };
    const notesFromState = getFilter(state);
    should(notesFromState).eql(filter);
  });
  it('Should get empty string as filter', () => {
    const state = {
      notes: {},
    };
    const notesFromState = getFilter(state);
    should(notesFromState).eql('');
  });
  it('Should get sort object', () => {
    const sort = 'test';
    const state = {
      notes: {
        sort,
      },
    };
    const notesFromState = getSort(state);
    should(notesFromState).eql(sort);
  });
  it('Should get empty sort object', () => {
    const state = {
      notes: {},
    };
    const notesFromState = getSort(state);
    should(notesFromState).eql(undefined);
  });
  it('Should regexp work', () => {
    const test = 'TesTeu';
    test.should.match(regexp('testeu'));
  });
  it('Should regexp not work', () => {
    const test = 'aucunrapport';
    test.should.not.match(regexp('testeu'));
  });
  it('nmatch should return length of 0', () => {
    const filter = 'filter';
    const content = 'content';
    const matchResult = nmatch(filter, content);
    should(matchResult).eql(0);
  });
  it('nmatch should return length of 1', () => {
    const filter = 'content';
    const content = 'content';
    const matchResult = nmatch(filter, content);
    should(matchResult).eql(1);
  });
  it('doFilter should return an array of length 1', () => {
    const filter = '1';
    const notes = [
      { content: '1' },
      { content: '2' },
      { content: '3' },
      { content: '4' },
      { content: '5' },
    ];
    const filtered = doFilter(filter, notes);
    should(filtered.length).eql(1);
  });
  it('doFilter should return an array of length 0', () => {
    const filter = '6';
    const notes = [
      { content: '1' },
      { content: '2' },
      { content: '3' },
      { content: '4' },
      { content: '5' },
    ];
    const filtered = doFilter(filter, notes);
    should(filtered.length).eql(0);
  });
  it('doFilter should return an array of length 5', () => {
    const filter = '1';
    const notes = [
      { content: '1' },
      { content: '1' },
      { content: '1' },
      { content: '1' },
      { content: '1' },
    ];
    const filtered = doFilter(filter, notes);
    should(filtered.length).eql(5);
  });
  it('getVisibleNotes array should have a length of 5', () => {
    const state = {
      notes: {
        filter: '1',
        data: [
          { content: '1' },
          { content: '1' },
          { content: '1' },
          { content: '1' },
          { content: '1' },
        ],
      },
    };
    const visibleNotes = getVisibleNotes(state);
    should(visibleNotes.length).eql(5);
  });
  it('getVisibleNotes should be equal to expected array', () => {
    const state = {
      notes: {
        filter: '1',
        data: [
          { content: '1' },
          { content: '2' },
          { content: '3' },
          { content: '4' },
          { content: '5' },
        ],
      },
    };
    const visibleNotes = getVisibleNotes(state);
    const expected = [{ content: '1' }];
    should(visibleNotes).eql(expected);
  });
});
