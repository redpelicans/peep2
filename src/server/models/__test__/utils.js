import mongobless from 'mongobless';
import config from '../../../../config';

export const connect = ctx => {
  const opt = process.env['NODE_ENV'] === 'travis' ? {host: 'localhost', port: 27017, database: 'tests'} : config.db;
  return mongobless.connect(opt).then((db) => { ctx.DB = db; return db });
};

export const close = () => mongobless.close();
export const drop = (ctx) => ctx.DB.dropDatabase();
export const load = (ctx, data) => {
  const names = Object.keys(data.collections);
  const loads = names.map(name => ctx.DB.collection(name).insert(data.collections[name]));
  return Promise.all(loads);
};


