import should from 'should';
import sinon from 'sinon';
import { cities } from '../cities';
import { Company } from '../../models';

const data = {
  collections:{
    companies: [
      { address: { city: 'C1' } },
      { address: { city: 'C2' } },
      { address: { city: 'Paris' } },
    ],
  }
};

describe('Cities service', function() {
  it('should load', (done) => {
    const companyStub = sinon.stub(Company, 'findAll', () => Promise.resolve(data.collections.companies));
    const end = (...params) => {
      companyStub.restore();
      done(...params);
    };
    cities.load()
      .then( (c) => {
        should(c).eql(['C1', 'C2', 'Paris']);
        end();
    })
    .catch(end);
  });

});


