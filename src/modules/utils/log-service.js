
const { createLogger, format, transports } = require('winston');
const { combine, timestamp } = format;

let logger = null;

let loggerConfig = {
  context: 'UNKNOWN_CONTEXT',
  level: 'debug'
};

const appendContext = format(function (logEvent, opts) {
  logEvent.context = loggerConfig.context;
  return logEvent;
});

if (!logger) {
  logger = createLogger({
    level: loggerConfig.level,
    format: combine(
      timestamp(),
      appendContext(),
      format.json()
    ),
    transports: [new transports.Console()]
  })
}

logger.__proto__.setContext = function (context) {
  if (!context)
    throw new Error('Invalid logger context - context cannot be empty/undefined.');
  loggerConfig.context = context;
}

logger.__proto__.setLevel = function (level = '') {
  level = level.toLowerCase();
  if (level === 'error' ||
    level === 'warn' ||
    level === 'info' ||
    level === 'verbose' ||
    level === 'debug' ||
    level === 'silly'
  ) {
    logger.level = level;
  }
  else {
    throw new Error('Invalid logger level - only following levels are ALLOWED - error/warn/info/verbose/debug/silly.');
  }
}

module.exports = logger;