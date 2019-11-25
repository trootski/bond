const registerUncaughtErrors = require('./uncaught-errors.js');
const config = require('nconf');

config.file(`${__dirname}/config/config.json`);

module.exports = {
  config,
  registerUncaughtErrors,
}
