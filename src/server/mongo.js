import mongobless from 'mongobless';
import debug from 'debug';
import R from 'ramda';
import { Person, Company, Note } from './models';

const loginfo = debug('peep:mogobless');

// TODO: should be transfered to mongobless: one day ....
const ensureIndexes = () => {
  const tasks = [
    Person.collection.ensureIndex({ email: 1 }, { unique: false, background: true }),
    Person.collection.ensureIndex({ company_id: 1 }, { background: true }),
    Person.collection.ensureIndex({ skills: 1 }, { background: true }),
    Person.collection.ensureIndex({ tags: 1 }, { background: true }),
    Note.collection.ensureIndex({ entityId: 1 }, { background: true }),
    Company.collection.ensureIndex({ 'address.city': 1 }, { background: true }),
    Company.collection.ensureIndex({ 'address.country': 1 }, { background: true }),
    Company.collection.ensureIndex({ tags: 1 }, { background: true }),
  ];

  return Promise.all(tasks);
};
const init = (ctx) => {
  const { config: { db } } = ctx;
  return mongobless
    .connect(R.merge({ verbose: false }, db))
    .then(conx => ensureIndexes()
      .then(() => {
        loginfo('Peep models are ready to help you ...');
        return { ...ctx, db: conx };
      })
    );
};

export default init;
