const Koa = require('koa');
const KoaStatic = require('koa-static');
const cors = require('@koa/cors');
const app = new Koa();

const db = require('../database/bond-movie-data.json');
var livereload = require('livereload');
var server = livereload.createServer();
server.watch('../vanilla/public');

app.use(cors({
  origin: '*',
}));

app.use(KoaStatic('../vanilla/public', {}));

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

app.use(async ctx => {
  if (ctx.request.path === '/films' && ctx.request.method === 'GET') {
    ctx.body = {'ok':true,'data':db};
  }
});

app.listen(3000);
