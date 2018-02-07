import config from '../../../../params';
import { Client, Company } from '..';
import { connect, close, drop, load } from '../../utils/tests';

const data = {
  collections: {
    companies: [
      {
        _id: 1,
        name: 'name1',
        type: 'client',
      },
      {
        name: 'name2',
        type: 'client',
      },
      {
        name: 'name3',
        type: 'partner',
      },
      {
        name: 'name4',
        type: 'partner',
        isDeleted: true,
      },
    ],
  },
};

const ctx = {};
beforeAll(() => connect(config.db).then(db => (ctx.db = db)));
afterAll(close);

describe('Companies models', () => {
  beforeEach(() => drop(ctx.db).then(() => load(ctx.db, data)));

  it('should find all', done => {
    Company.loadAll()
      .then(objs => {
        const names = objs.map(obj => obj.name).join('');
        expect(names).toEqual(
          data.collections.companies
            .filter(c => !c.isDeleted)
            .map(obj => obj.name)
            .join(''),
        );
        expect(objs[0].is(Client)).toBeTruthy();
        done();
      })
      .catch(done);
  });

  it('should load all', done => {
    Company.loadAll({ name: 'name3' })
      .then(objs => {
        const names = objs.map(obj => obj.name).join('');
        expect(names).toEqual('name3');
        done();
      })
      .catch(done);
  });

  it('should load one', done => {
    const { _id } = data.collections.companies[0];
    Company.loadOne(_id)
      .then(obj => {
        expect(obj._id).toEqual(_id);
        done();
      })
      .catch(done);
  });

  it('should find one', done => {
    const { name } = data.collections.companies[0];
    Company.findOne({ name })
      .then(obj => {
        expect(obj.name).toEqual(name);
        done();
      })
      .catch(done);
  });
});
