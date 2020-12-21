const config = require('nconf');
const cors = require('@koa/cors');
const Koa = require('koa');
const KoaBodyParser = require('koa-bodyparser');
const KoaRouter = require('koa-router');
const logger = require('pino')().child({ app: 'MOVIE-METADATA-API' });
const path = require('path');

const {
  getMovie,
} = require('./api/index.js');

const docRoot = __dirname.split(path.sep).slice(0, -1).join(path.sep);
config.file(`${docRoot}/config/config.json`);

logger.info({
  msg: `Starting up...\n\nSettings: ${JSON.stringify(config.get())}`,
})

const app = new Koa();

app.use(cors({
  origin: '*',
}));

app.use(KoaBodyParser());

app.use(async (ctx, next) => {
  ctx.logger = logger;
  ctx.config = config;
  await next();
});

const router = new KoaRouter();
router.get('/api/v1/movies/:title', getMovie);
app.use(router.routes());

app.listen(3000);

