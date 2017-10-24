module.exports = {
  secretKey: '1',
  siteUrl: 'http://peep.redpelicans.com',
  compress: true,
  devtool: false,
  devServer: null,
  server: {
    host: '0.0.0.0',
    port: 4444,
  },
  db: {
    host: 'rp3.redpelicans.com',
    port: 27017,
    options: {
      auto_reconnect: true,
      poolSize: 10,
      w: 1,
      strict: true,
      native_parser: true,
    },
    database: 'timetrack',
  },
};
