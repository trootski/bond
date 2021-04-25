const redis = require("redis");

let consumerClient;
let producerClient;

const getConsumer = ({ config, logger }) => { 
  if (!!consumerClient) {
    return consumerClient;
  }
  consumerClient = redis.createClient(config.get('redis:url'));
  consumerClient.on("error", logger.error);
  return consumerClient;
};

const getProducer = ({ config, logger }) => { 
  if (!!producerClient) {
    return producerClient; 
  }
  producerClient = redis.createClient(config.get('redis:url'));
  producerClient.on("error", logger.error);
  return producerClient; 
};

module.exports = { 
  getConsumer, 
  getProducer,
};

