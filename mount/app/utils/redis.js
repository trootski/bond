const redis = require("redis");
const { promisify } = require('util');

const getAsync = ({ config, logger }) => {
  const client = redis.createClient({
    host: config.get('redis:url'),
    port: config.get('redis:port'),
  });
  client.on("error", function (err) {
    logger.error({ err });
    process.exit(0);
  });

  return promisify(client.get).bind(client);
}

const getsetAsync = ({ config, logger }) => {
  const client = redis.createClient({
    host: config.get('redis:url'),
    port: config.get('redis:port'),
  });
  client.on("error", function (err) {
    logger.error({ err });
    process.exit(0);
  });
  return promisify(client.getset).bind(client);
};

module.exports = {
    getAsync,
    getsetAsync,
};