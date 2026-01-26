const redis = require("redis");

let client = null;

const getClient = async ({ config, logger }) => {
  if (client && client.isOpen) {
    return client;
  }

  const url = `redis://${config.get('redis:url')}:${config.get('redis:port')}`;
  client = redis.createClient({ url });

  client.on("error", function (err) {
    logger.error({ err });
  });

  await client.connect();
  return client;
};

const getAsync = ({ config, logger }) => {
  return async (key) => {
    const c = await getClient({ config, logger });
    return c.get(key);
  };
};

const setAsync = ({ config, logger }) => {
  return async (key, value, exFlag, exValue) => {
    const c = await getClient({ config, logger });
    if (exFlag === 'EX') {
      return c.set(key, value, { EX: exValue });
    }
    return c.set(key, value);
  };
};

const delAsync = ({ config, logger }) => {
  return async (key) => {
    const c = await getClient({ config, logger });
    return c.del(key);
  };
};

module.exports = {
  delAsync,
  getAsync,
  setAsync,
};
