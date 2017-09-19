import sinon from 'sinon';
import { cities } from '../cities';
import { Company } from '../../models';

const data = {
  collections: {
    companies: [
      { address: { city: 'C1' } },
      { address: { city: 'C2' } },
      { address: { city: 'Paris' } },
    ],
  },
};

describe('Cities service', () => {
  it('expect load', (done) => {
    const companyStub = sinon.stub(Company, 'findAll').callsFake(() => Promise.resolve(data.collections.companies));
    const end = (...params) => {
      companyStub.restore();
      done(...params);
    };
    cities.load()
      .then((c) => {
        expect(c).toEqual(['C1', 'C2', 'Paris']);
        end();
      })
      .catch(end);
  });
});

