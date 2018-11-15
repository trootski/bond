const Koa = require('koa');
const KoaStatic = require('koa-static');
const KoaRouter = require('koa-router');
const cors = require('@koa/cors');
const {
  getJSONDBFilms,
  getJSONDBIndex,
} = require('./api/jsondb');
const {
  getDynamoDBFilms,
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

router.get('/dynamodb/films', getDynamoDBFilms);

app.use(router.routes());

app.listen(3000);

