let db;
const { getMovieDetails } = require('../utils/omdb-api.js');
const filmMeta = require('../../film-data/film-meta.json');
const fs = require('fs');

const getJSONDBIndex = async (ctx, next) => {
  ctx.body = { 'ok': true };
};

const getJSONDBFilms = async ctx => {
  db = require('../../cache/film-data-import.json');
  ctx.body = { 'ok':true, 'data':db };
};

const importFilmsToJSON = async ctx => {
  const res = await Promise.all(
    filmMeta.data
      .map(v => v.title)
      .map(getMovieDetails)
  );

  try {
    fs.writeFileSync(
      './cache/film-data-import.json',
      JSON.stringify(res)
    );
  } catch (e) {
    console.error('Error writing cache, ', e);
    ctx.body = { 'ok':false };
    return;
  }

  db = require('../../cache/film-data-import.json');

  ctx.body = { 'ok':true, 'data':db };
};

module.exports = {
  getJSONDBFilms,
  getJSONDBIndex,
  importFilmsToJSON,
};
