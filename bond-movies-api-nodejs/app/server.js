const config = require('nconf');
const cors = require('@koa/cors');
const {
  errorHandling,
} = require('./middleware');
const Koa = require('koa');
const KoaBodyParser = require('koa-bodyparser');
const KoaRouter = require('koa-router');
const logger = require('pino')().child({ app: 'BOND-API' });
const path = require('path');

const {
  getAllMovies,
  getMovie,
  putMovie,
  setup,
} = require('./api/index.js');

if (!!process.env.BOND_ENV && process.env.BOND_ENV === 'docker') {
  config.file('docker', { file: `${process.cwd()}/config/config-docker.json` });
}
config.file(`${process.cwd()}/config/config.json`);

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
router.put('/v1/bond-movies/:title', putMovie);
router.get('/v1/setup', setup);
app.use(router.routes());

app.listen(3001);

// Hacky setup method...
setTimeout(() => {
  setup({ config, logger }, () => Promise.resolve(true));
}, 1000);

