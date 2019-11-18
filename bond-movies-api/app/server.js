const config = require('nconf');
const cors = require('@koa/cors');
const Koa = require('koa');
const KoaBodyParser = require('koa-bodyparser');
const KoaRouter = require('koa-router');
const KoaStatic = require('koa-static');
const logger = require('pino')().child({ app: 'BOND-API' });

const {
  getAllMovies,
  getMovie,
  putMovie,
} = require('./api/index.js');

config.file('/opt/bond-movies-api/config/config.json');

logger.info({
  msg: `Starting up...\n\nSettings: ${JSON.stringify(config.get())}`,
})

const app = new Koa();
const router = new KoaRouter();

var livereload = require('livereload');
var server = livereload.createServer();

app.use(cors({
  origin: '*',
}));

app.use(KoaBodyParser());

app.use(async (ctx, next) => {
  ctx.logger = logger;
  ctx.config = config;
  await next();
});

router.get('/v1/bond-movies/:title', getMovie);
// router.get('/v1/bond-movies', getAllMovies);
router.put('/v1/bond-movies', putMovie);

app.use(router.routes());

app.listen(3000);

