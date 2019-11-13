const registerUncaughtErrors = ({ logger }) => {
  process.on('uncaughtException', function (err) {
    logger.error({ error: err.message });
    process.exit(0);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    logger.error({ error: (reason.stack || reason) });
    process.exit(0);
  });
};

module.exports = registerUncaughtErrors;
