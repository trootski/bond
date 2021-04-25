const { pushBondMovieUpdate } = require('../service/queue.js');

const addMovieReviewUpdate = async (ctx, next) => {
  const { request: { body }, config, logger } = ctx;
  try {
    logger.info({ msg: `Adding Bond movie to queue: ${body.title}` });
    await pushBondMovieUpdate({ body, config, logger });
    ctx.status = 204;
    ctx.body = '';
  } catch (err) {
    logger.error({ err });
    ctx.status = 500;
    ctx.body = '';
  }

  await next();
};

module.exports = addMovieReviewUpdate;
