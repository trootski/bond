const fetch = require('node-fetch');

const getMovieMetadata = ({ config, logger }) => async movieTitle => {
  logger.info({ msg: `Getting live data for ${movieTitle}.` })
  const apiKey = config.get('omdb:key');
  const omdbURL = `http://www.omdbapi.com/?apikey=${apiKey}&t=${movieTitle}`;
  const results = await fetch(omdbURL);
  const resultJson = await results.json();
  logger.info({ result: resultJson });
  const {
    imdbID,
    Plot,
    Poster,
    Year,
    Runtime,
    Title,
  } = resultJson;
  return {
    imdbid: imdbID,
    poster: Poster,
    runtime: Runtime,
    synopsis: Plot,
    title: Title,
    year: Year,
  };
};

module.exports = {
  getMovieMetadata,
};
