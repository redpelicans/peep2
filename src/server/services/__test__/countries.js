import should from 'should';
import sinon from 'sinon';
import { countries } from '../countries';
import { Company } from '../../models';

const data = {
  collections:{
    companies: [
      { address: { country: 'C1' } },
      { address: { country: 'C2' } },
      { address: { country: 'France' } },
    ],
  }
};

describe('Countries service', function() {
  it('should load', (done) => {
    const companyStub = sinon.stub(Company, 'findAll', () => Promise.resolve(data.collections.companies));
    const end = (...params) => {
      companyStub.restore();
      done(...params);
    };
    countries.load()
      .then( countries => {
        should(countries).eql(['C1', 'C2', 'France']);
        end();
    })
    .catch(end);
  });

});


