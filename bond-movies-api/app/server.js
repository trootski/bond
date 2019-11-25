const { config } = require('bond-common');
const cors = require('@koa/cors');
const {
  errorHandling,
} = require('./middleware');
const Koa = require('koa');
const KoaBodyParser = require('koa-bodyparser');
const KoaRouter = require('koa-router');
const KoaStatic = require('koa-static');
const logger = require('pino')().child({ app: 'BOND-API' });

const {
  getAllMovies,
  getMovie,
  putMovie,
  setup,
} = require('./api/index.js');

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
router.get('/v1/bond-movies', getAllMovies);
router.get('/v1/bond-movies/:title', getMovie);
router.put('/v1/bond-movies', putMovie);
router.get('/v1/setup', setup);
app.use(router.routes());

app.listen(3000);

// Hacky setup method...
setTimeout(() => {
  setup({ config, logger }, () => Promise.resolve(true));
}, 1000);

