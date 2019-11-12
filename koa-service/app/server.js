const config = require('nconf');
const cors = require('@koa/cors');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaStatic = require('koa-static');
const logger = require('pino')();

const {
  getDynamoDBFilms,
} = require('./api/dynamodb');

config.file('./config/config.json');
console.log('settings: ', config.get())

const app = new Koa();
const router = new KoaRouter();

var livereload = require('livereload');
var server = livereload.createServer();

app.use(cors({
  origin: '*',
}));

app.use(async (ctx, next) => {
  ctx.logger = logger;
  ctx.config = config;
  await next();
});

router.get('*', getDynamoDBFilms);

app.use(router.routes());

app.listen(3000);

