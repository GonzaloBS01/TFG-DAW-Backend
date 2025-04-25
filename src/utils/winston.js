import winston from 'winston';

import options from '../config/winston-config.js';

const { format, transports, createLogger } = winston;

const {
  combine, timestamp, printf, colorize,
} = format;

const logger = createLogger({
  transports: [
    new transports.Console({
      ...options.console,
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize(),
        printf((info) => `[${info.timestamp}] ${info.level} ${info.message}`),
      ),
      silent: process.env.NODE_ENV === 'test',
    }),
  ],
  exitOnError: false,
});
//  aqui se ha elimido los args y formatLogArguments.
const debug = function debug() {
  logger.log('debug');
};

const info = function info() {
  logger.log('info');
};

const warn = function warn() {
  logger.log('warn');
};

const error = function error() {
  logger.log('error');
};

const log = logger;

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

const { stream } = logger;

module.exports = {
  debug,
  info,
  warn,
  error,
  stream,
  log,
};
