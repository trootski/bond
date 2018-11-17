const Koa = require('koa');
const KoaStatic = require('koa-static');
const KoaRouter = require('koa-router');
const cors = require('@koa/cors');
const {
  getJSONDBFilms,
  getJSONDBIndex,
  importFilmsToJSON,
} = require('./api/jsondb');
const {
  getDynamoDBFilms,
  importFilmsToDynamoDB,
  resetDynamoDB,
} = require('./api/dynamodb');

const app = new Koa();
const router = new KoaRouter();

var livereload = require('livereload');
var server = livereload.createServer();

// Serve the vanilla version of the application
server.watch('../vanilla/public');

app.use(cors({
  origin: '*',
}));

router.get('/jsondb/', getJSONDBIndex);
router.get('/jsondb/films', getJSONDBFilms);
router.get('/jsondb/import-films', importFilmsToJSON);

router.get('/dynamodb/films', getDynamoDBFilms);
router.get('/dynamodb/import-films', importFilmsToDynamoDB);
router.get('/dynamodb/reset', resetDynamoDB);

app.use(router.routes());

app.listen(3000);

