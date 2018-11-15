const db = require('../../../database/bond-movie-data.json');

const getJSONDBIndex = async (ctx, next) => {
  ctx.body = { 'ok': true };
};

const getJSONDBFilms = async ctx => {
  ctx.body = { 'ok':true, 'data':db };
};
module.exports = {
  getJSONDBFilms,
  getJSONDBIndex,
};
