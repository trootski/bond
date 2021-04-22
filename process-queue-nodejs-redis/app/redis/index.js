const redis = require("redis");

let consumerClient;
let producerClient;

const getConsumer = ({ config, logger }) => { 
    if (consumerClient === null) {
        consumerClient = redis.createClient({ 
            redis_url: config.get('redis:url'),
        });
        consumerClient.on("error", logger.error);
    }
    return consumerClient;
};

const getProducer = ({ config, logger }) => { 
    logger.info({ msg: "Getting the producer", data: producerClient });
    if (!!producerClient) {
        return producerClient; 
    }
    logger.info({ msg: "No producer created yet", url: config.get('redis:url') });
    producerClient = redis.createClient(config.get('redis:url'));
    logger.info({ msg: "The producer is", data: producerClient });
    producerClient.on("error", logger.error);
    return producerClient; 
};

module.exports = { 
    getConsumer, 
    getProducer,
};

