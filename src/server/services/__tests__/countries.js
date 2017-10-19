import sinon from 'sinon';
import { countries } from '../countries';
import { Company } from '../../models';
import { manageError } from '../../utils/tests';

const data = {
  collections: {
    companies: [
      { address: { country: 'C1' } },
      { address: { country: 'C2' } },
      { address: { country: 'France' } },
    ],
  },
};

describe('Countries service', () => {
  it('expect load', () => {
    const companyStub = sinon
      .stub(Company, 'findAll')
      .callsFake(() => Promise.resolve(data.collections.companies));
    const end = e => {
      companyStub.restore();
      manageError(e);
    };
    return countries
      .load()
      .then(countries => {
        expect(countries).toEqual(['C1', 'C2', 'France']);
        end();
      })
      .catch(end);
  });
});
