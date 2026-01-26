const getMovieMetadata = ({ config, logger }) => async movieTitle => {
  logger.info({ msg: `Getting live data for ${movieTitle}. (TMDB)` })
  const apiKey = config.get('tmdb:key');
  const tmdbSearchURL = `${config.get('tmdb:base_url')}/search/movie?api_key=${apiKey}&query=${movieTitle}`;
  const results = await fetch(tmdbSearchURL);
  const resultJson = await results.json();
  const tmdbMovieID = resultJson.results[0].id;
  const tmdbMovieURL = `${config.get('tmdb:base_url')}/movie/${tmdbMovieID}?api_key=${apiKey}`;
  const movieMetadataResult = await fetch(tmdbMovieURL);
  const movieMetadata = await movieMetadataResult.json();
  const {
    imdb_id,
    overview,
    poster_path,
    release_date,
    runtime,
    title,
  } = movieMetadata;
  const splitReleaseDate = release_date.split('-');
  return {
    imdb_id,
    poster: `${config.get('tmdb:poster_base_url')}${poster_path}`,
    runtime: `${runtime} mins`,
    synopsis: overview,
    title,
    year: splitReleaseDate[0],
  };
}

module.exports = {
  getMovieMetadata,
};
