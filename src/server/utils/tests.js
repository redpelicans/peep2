import mongobless from 'mongobless';

export const connect = db => {
  const opt =
    process.env.NODE_ENV === 'travis'
      ? { host: 'localhost', port: 27017, database: 'tests' }
      : db;
  return mongobless.connect(opt);
};

export const close = () => mongobless.close();
export const drop = db => db.dropDatabase();
export const load = (db, data) => {
  const names = Object.keys(data.collections);
  const loads = names.map(name =>
    db.collection(name).insert(data.collections[name]),
  );
  return Promise.all(loads);
};

export const manageError = e => {
  if (e) throw e.error || e;
};

export const manageFail = done => e => done.fail(e.error || e);
