const Koa = require('koa');
const KoaBodyParser = require('koa-bodyparser');
const KoaRouter = require('koa-router');
const config = require('nconf');
const cors = require('@koa/cors');
const logger = require('pino')().child({ app: 'PROCESS-QUEUE' });
const path = require('path');
const process = require('process');

const {
  addMovieReviewUpdate,
} = require('./api/index.js');
const setup = require('./runner/setup.js');

const docRoot = __dirname.split(path.sep).slice(0, -1).join(path.sep);
config.file(`${docRoot}/config/config.json`);

logger.info({
  msg: `Starting up...\n\nSettings: ${JSON.stringify(config.get())}`,
});

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

setup({ config, logger }).catch(err => {
  logger.error({ type: 'SETUP_ERROR', err });
  process.exit(1);
});

const router = new KoaRouter();
router.post('/v1/bond-movie-events/review-updates/enqueue', addMovieReviewUpdate);
app.use(router.routes());

logger.info({ msg: 'Listening on 3002', routes: router.stack.map(i => i.path)  });
app.listen(3006);


