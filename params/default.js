const path = require('path');

module.exports = {
  locale: 'en_US',
  publicPath: path.join(__dirname, '../public'),
  buildPath: path.join(__dirname, '../build'),
  sessionDuration: 8,
  google: {
    clientId: '223226395678-737dmg2e71b52hqr90nk7c9vtg7b40o5.apps.googleusercontent.com',
  },
};
