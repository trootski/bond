const config = require('nconf');

config.file('localConfig', './config.json');
config.file('dbConfig', '../dynamodb/config.json');

module.exports = config;
