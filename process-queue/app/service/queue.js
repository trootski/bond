const { getAdmin } = require('../kafka/kafka.js');

const getQueueLength = ({ config, logger }) => new Promise(async (resolve, reject) => {
  const admin = await getAdmin({ config, logger });
  logger.info({ msg: 'setup for getting configs' });
  const resource = {
    resourceType: admin.RESOURCE_TYPES.topic,   // 'broker' or 'topic'
    resourceName: config.get('kafka:bond_topic'),
    configNames: []           // specific config names, or empty array to return all,
  };

  const payload = {
    resources: [resource],
    includeSynonyms: false,   // requires kafka 2.0+
  };

  logger.info({ data: JSON.stringify(payload) });
  admin.describeConfigs(payload, (err, res) => {
    if (err) {
      logger.error({ type: 'DESCRIBE_CONFIGS_ERR', err });
      return reject(err);
    }
    logger.info({ type: 'got configs', msg: JSON.stringify(res,null,1) });
    return resolve(res);
  });
});

module.exports = getQueueLength;
