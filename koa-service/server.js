const Koa = require('koa');
const KoaStatic = require('koa-static');
const KoaRouter = require('koa-router');
const cors = require('@koa/cors');
const {
  getDynamoDBFilms,
} = require('./api/dynamodb');
const logger = require('pino')();

const app = new Koa();
const router = new KoaRouter();

var livereload = require('livereload');
var server = livereload.createServer();

// Serve the vanilla version of the application
server.watch('../vanilla/public');

app.use(cors({
  origin: '*',
}));

app.use(async (ctx, next) => {
  ctx.logger = logger;
  await next();
});

router.get('*', getDynamoDBFilms);

app.use(router.routes());

app.listen(3000);

