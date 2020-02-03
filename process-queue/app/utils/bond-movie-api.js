const fetch = require('node-fetch');

const setBondMovieAPI = ({ config, logger }) => async data => {
  return fetch(`${config.get('app:bond_movies_api_url')}/v1/bond-movies/${data.title}`, {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PUT',
  });
};

module.exports = {
  setBondMovieAPI,
};
