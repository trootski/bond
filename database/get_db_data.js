'use strict';

const request = require('request');
const fs = require('fs');

const filmTitles = require('./films.json');

const apiKey = '78ab6537';

const getMovieDetails = (title) => new Promise(resolve => {
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

console.log(filmTitles);
Promise.all(
    filmTitles.titles.map(getMovieDetails)
).then(v => {
    console.log(v);
    fs.writeFileSync('bond-movie-data.json', JSON.stringify(v));
});

