const fetch = require('node-fetch');
const { deepCopyAndLowerCaseProps } = require('../utils/deepCopyAndLowerCaseProps.js');

const getMovieMetadata = ({ config, logger }) => async movieTitle => {
  logger.info({ msg: `Getting live data for ${movieTitle}.` })
  const apiKey = config.get('omdb:key');
  const omdbURL = `http://www.omdbapi.com/?apikey=${apiKey}&t=${movieTitle}`;
  const results = await fetch(omdbURL);
  const resultJson = await results.json();
  return deepCopyAndLowerCaseProps(resultJson);
};

module.exports = {
  getMovieMetadata,
};
