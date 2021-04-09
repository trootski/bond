const { getConsumer, getProducer } = require('../redis');
const { rpush } = require('redis');
const { promisify } = require("util");
const { getMovieMetadataDBData } = require('./movie-metadata.js');
const { setBondMovieAPI } = require('./bond-movie-api.js');

const pushBondMovieUpdate = async ({ body, config, logger }) => {
    const producer = getProducer({ config, logger });
    logger.info({ msg: "here", val: producer });
    const rpushAsync = promisify(producer.rpush).bind(producer);
    try {
        await rpushAsync(
            config.get('redis:bond_list'),
            JSON.stringify(body)
        );
        logger.debug({ msg: `Sent message: ${JSON.stringify(body)}` });
        return true;
    } catch (err) {
        logger.error({ type: 'PUSH_MESSAGE_ERROR', err });
        throw err;
    } finally {
        await producer.disconnect();
    }
};

// const startQueueListener = async ({ config, logger }) => {
//             topic: config.get('kafka:bond_topic'),
//             // fromBeginning: true,
//         });
//         await consumer.run({
//             eachMessage: async ({ topic, partition, message }) => {
//                 const getMovieMetadataCtx = getMovieMetadataDBData({ config, logger });
//                 const setBondMovieAPICtx = setBondMovieAPI({ config, logger });
//                 const getMessageValue = () => {
//                     try {
//                         return JSON.parse(message.value)
//                     } catch(err) {
//                         logger.error({ type: 'CONSUMER_MESSAGE_JSON', err });
//                         return null;
//                     }
//                 };
//                 const messageValue = getMessageValue();
//                 const movieMetadata = await getMovieMetadataCtx(messageValue.title);
// 
//                 const movieData = { ...messageValue, movie_type: 'movie', ...movieMetadata };
// 
//                 logger.info({ type: 'CONSUMER_RECEIVE', msg: `Setting bond movie '${movieData.title}'` });
//                 try {
//                     await setBondMovieAPICtx(movieData);
//                 } catch (err) {
//                     logger.error({ type: 'CONSUMER_PUT_MOVIE', err });
//                 }
//             },
//         });
//     } catch (err) {
//         logger.error({ type: 'QUEUE_LISTENER_ERROR', err })
//     }
// };


module.exports = {
    // connectAndCreateTopic,
    pushBondMovieUpdate,
    // startQueueListener,
};

