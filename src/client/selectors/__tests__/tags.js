import should from 'should';
import { mergeTags, getFlattenTags, getFilter, regexp } from '../tags';

describe('Selectors:people', () => {
  it('Should get an empty filter', () => {
    const state = {
      tags: {},
    };
    const filter = getFilter(state);
    should(filter).eql(undefined);
  });
  it('Should get an empty filter', () => {
    const expected = 'test';
    const state = {
      tags: { filter: expected },
    };
    const filter = getFilter(state);
    should(filter).eql(expected);
  });
  it('Should regexp work', () => {
    const test = 'TesTeu';
    const expected = 'testeu';
    test.should.match(regexp(expected));
  });
  it('Should regexp not work', () => {
    const test = 'aucunrapport';
    const expected = 'testeu';
    test.should.not.match(regexp(expected));
  });
  it('Should get flatten tags', () => {
    const list = [
      { tags: ['a', 'b'] },
      { tags: ['c', 'd'] },
      { tags: ['e', 'f'] },
    ];
    const flattened = getFlattenTags(list);
    const expected = ['a', 'b', 'c', 'd', 'e', 'f'];
    should(flattened).eql(expected);
  });
  it('Should get empty tags array', () => {
    const list = [];
    const flattened = getFlattenTags(list);
    const expected = [];
    should(flattened).eql(expected);
  });
  it('Should not merge tags in empty lists', () => {
    const lists = [];
    const merged = mergeTags(lists);
    const expected = [];
    should(merged).eql(expected);
  });
  it('Should merge tags from multiple lists', () => {
    const lists = [
      [{ tags: ['a', 'b'] }, { tags: ['c', 'd'] }],
      [{ tags: ['e', 'f'] }, { tags: ['g', 'h'] }],
      [{ tags: ['i', 'j'] }, { tags: ['k', 'l'] }],
    ];
    const merged = mergeTags(lists);
    const expected = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
    ];
    should(merged).eql(expected);
  });
  it('Should not merge tags in empty lists', () => {
    const lists = [];
    const merged = mergeTags(lists);
    const expected = [];
    should(merged).eql(expected);
  });
});
