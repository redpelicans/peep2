/* eslint-disable */

console.log(`running in ${process.env.NODE_ENV} mode.`);

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./configureStore.dev');
} else {
  module.exports = require('./configureStore.prod');
}
