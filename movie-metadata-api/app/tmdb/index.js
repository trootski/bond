const fetch = require('node-fetch');

const getMovieMetadata = ({ config, logger }) => async movieTitle => {
  logger.info({ msg: `Getting live data for ${movieTitle}.` })
  const apiKey = config.get('tmdb:key');
  const tmdbURL = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieTitle}`;
  const results = await fetch(tmdbURL);
  return (await results.json());
}

module.exports = {
  getMovieMetadata,
};
