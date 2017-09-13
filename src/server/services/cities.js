import debug from 'debug';
import R from 'ramda';
import { Company } from '../models';
import { checkUser } from './utils';

const basecities = ['Paris'];
const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'cities';

export const cities = {
  load() {
    return Company.loadAll({ 'address.city': { $exists: true } }, { 'address.city': 1 })
      .then((companies) => {
        const hallcities = R.reduce((res, company) => {
          const city = R.path(['address', 'city'], company);
          if (city) res[city] = city; // eslint-disable-line no-param-reassign
          return res;
        }, {}, companies);
        const hbasecities = R.reduce((res, city) => { res[city] = city; return res; }, {}, basecities); // eslint-disable-line no-param-reassign
        const allcities = R.merge(hbasecities, hallcities);
        return R.values(allcities).sort();
      });
  },
};

const init = (evtx) => {
  evtx
    .use(SERVICE_NAME, cities)
    .service(SERVICE_NAME).before({ all: [checkUser()] });
  loginfo('cities service registered');
};

export default init;
