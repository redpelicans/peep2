import debug from 'debug';
import { map, add, toPairs, mergeWith } from 'ramda';
import { Person, Company } from '../models';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'tags';

const groupByTags = (collection) => {
  const htags = {};
  map(obj => {
    map(({ tag = [] }) => {
      htags[tag] = (!htags[tag]) ? 1 : htags[tag] + 1;
    }, obj.tags);
  }, collection);
};

export const tags = {
  load() {
    const loadCompanies = Company.loadAll({ tags: { $exists: true } }, { tags: 1 }).then(groupByTags);
    const loadPeople = Person.loadAll({ tags: { $exists: true } }, { tags: 1 }).then(groupByTags);
    return Promise.all([loadCompanies, loadPeople])
      .then(([companyTags, personTags]) => toPairs(mergeWith(add, companyTags, personTags)));
  },
};


const init = (evtx) => {
  evtx.use(SERVICE_NAME, tags);
  loginfo('tags service registered');
};

export default init;
