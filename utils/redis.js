const redis = require("redis");
const { promisify } = require('util');

const getAsync = ({ config, logger }) => {
  const client = redis.createClient({
    host: config.get('redis:url'),
    port: config.get('redis:port'),
  });
  return promisify(client.get).bind(client);
}

module.exports = {
    getAsync,
};
