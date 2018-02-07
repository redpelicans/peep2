module.exports = {
  db: {
    host: '127.0.0.1',
    port: 27017,
    options: {
      auto_reconnect: true,
      poolSize: 10,
      w: 1,
      strict: true,
      native_parser: true,
    },
    database: 'test',
  },
  server: {
    host: '127.0.0.1',
  },
};
