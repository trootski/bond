const fetch = require('node-fetch');

const filmMeta = require(config.get('app:film_meta_path'));

const getMovieDetails = (title) => {
  const apiKey = config.get('app:omdb_key');
  const omdbURL = `http://www.omdbapi.com/?apikey=${apiKey}&t=${title}`;
  return fetch(omdbURL);
};

const getMovieDetailsToCache = async () => {
  // Fetch movie details from OMDB for each movie title
  const res = await Promise.all(filmMeta.data
    .map(v => v.title)
    .map(getMovieDetails));
  // Resolve the json for each movie if possible as the promise value
  const movieData = await Promise.all(
    res.map(v => (v.status === 200) ? v.json() : Promise.resolve(null)));
  // Create a hash map of the movies to sync with redis
  return movieData.reduce((acc, cur) => {
    acc[cur.Title] = cur;
    return acc;
  }, {});
};

module.exports = {
  getMovieDetailsToCache,
};
