const errorHandling = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error({ err });
    switch (e.code) {
      case 'ResourceNotFoundException':
        ctx.response.status = 404;
        ctx.response.body = { code: 'FETCH_ERROR', message: 'Table missing' };
        break;
      default:
        logger.error({ err });
        ctx.response.status = 500;
        ctx.response.body = { code: 'err' };
    }
  }
};

module.exports = errorHandling;
