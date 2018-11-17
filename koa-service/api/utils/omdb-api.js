const request = require('request');

const getMovieDetails = (title) => new Promise(resolve => {
  const apiKey = '78ab6537';
  request({
    url: `http://www.omdbapi.com/?apikey=${apiKey}&t=${title}`,
  }, (err, resp) => {
    console.log(err);
    if (err !== null) {
      console.error(err);
      return;
    }
    resolve(JSON.parse(resp.body));
  });
});

module.exports = {
  getMovieDetails,
};
