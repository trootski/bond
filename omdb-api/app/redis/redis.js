const redis = require("redis");
const { promisify } = require('util');

const getAsync = ({ config, logger }) => {
  const client = redis.createClient({
    host: config.get('redis:url'),
    port: config.get('redis:port'),
  });
  client.on("error", function (err) {
    logger.error({ err });
  });

  return promisify(client.get).bind(client);
}

const setAsync = ({ config, logger }) => {
  const client = redis.createClient({
    host: config.get('redis:url'),
    port: config.get('redis:port'),
  });
  client.on("error", function (err) {
    logger.error({ err });
  });
  return promisify(client.set).bind(client);
};

const delAsync = ({ config, logger }) => {
  const client = redis.createClient({
    host: config.get('redis:url'),
    port: config.get('redis:port'),
  });
  client.on("error", function (err) {
    logger.error({ err });
  });
  return promisify(client.del).bind(client);
};

module.exports = {
  delAsync,
  getAsync,
  setAsync,
};
