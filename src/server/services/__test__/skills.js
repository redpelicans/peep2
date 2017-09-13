import should from 'should';
import sinon from 'sinon';
import R from 'ramda';
import { skills, baseskills } from '../skills';
import { Person } from '../../models';

const data = {
  collections:{
    people: [
      { skills: ['C1', 'C2'] },
      { skills: ['C1'] },
      { skills: ['C3'] },
    ],
  }
};

describe('Skills services', function() {
  it('should load', (done) => {
    const personStub = sinon.stub(Person, 'findAll', () => Promise.resolve(data.collections.people));
    const end = (...params) => {
      personStub.restore();
      done(...params);
    };
    skills.load()
      .then( skills => {
        const res = R.compose(R.sortBy(R.prop(0)), R.uniq, R.concat(baseskills))(['C1', 'C2', 'C3']);
        should(skills).eql(res);
        end();
    })
    .catch(end);
  });

});


