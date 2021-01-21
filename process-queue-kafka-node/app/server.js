const config = require('nconf');
const cors = require('@koa/cors');
const Koa = require('koa');
const KoaBodyParser = require('koa-bodyparser');
const KoaRouter = require('koa-router');
const logger = require('pino')().child({ app: 'PROCESS-QUEUE' });
const path = require('path');

const {
  addMovieReviewUpdate,
  setup,
} = require('./api/index.js');

const docRoot = __dirname.split(path.sep).slice(0, -1).join(path.sep);
config.file(`${docRoot}/config/config.json`);

if (!!process.env.BOND_MOVIES_API_URL) {
  config.set('app:bond_movies_api_url', process.env.BOND_MOVIES_API_URL);
}

if (!!process.env.MOVIE_METADATA_API_URL) {
  config.set('app:movie_metadata_api_url', process.env.MOVIE_METADATA_API_URL);
}

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
router.post('/v1/bond-movie-events/review-updates/enqueue', addMovieReviewUpdate);
router.get('/v1/setup', setup);
app.use(router.routes());

logger.info({ msg: 'Listening on 3005', routes: router.stack.map(i => i.path)  });
app.listen(3005);

// Hacky setup method...
setTimeout(() => {
  setup({ config, logger }, () => Promise.resolve(true));
}, 1000);

