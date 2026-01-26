const getMovieMetadataDBData = ({ config, logger }) => async title => {
  const metadataResponse = await fetch(`${config.get('app:movie_metadata_api_url')}/api/v1/movies/${title}`);
  try {
    return metadataJSON = await metadataResponse.json();
  } catch (err) {
    logger.err({ type: 'CONSUMER_MOVIE_METADATA_RESP', err });
    return null;
  }
};

module.exports = {
  getMovieMetadataDBData,
};
