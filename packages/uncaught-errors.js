const registerUncaughtErrors = ({ logger }) => {
  process.on('uncaughtException', function (err) {
    logger.error({ err });
    process.exit(0);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error({ err: (reason.stack || reason) });
    process.exit(0);
  });
};

module.exports = registerUncaughtErrors;
