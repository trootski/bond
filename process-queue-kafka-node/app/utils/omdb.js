const fetch = require('node-fetch');

const getOMDBData = ({ config, logger }) => async title => {
  const omdbDataResponse = await fetch(`${config.get('app:movie_metadata_api_url')}/api/v1/movies/${title}`);
  try {
    return omdbJSON = await omdbDataResponse.json();
  } catch (err) {
    logger.err({ type: 'CONSUMER_OMDB_RESP', err });
    return null;
  }
};

module.exports = {
  getOMDBData,
};
