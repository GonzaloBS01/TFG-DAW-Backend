import winston from 'winston';

import options from '../config/winston-config.js';

const { transports, createLogger } = winston;


const logger = createLogger({
  transports: [
    new transports.Console({
      ...options.console,
    }),
  ],
  exitOnError: false,
});

const debug = function debug(message) {
  logger.log('debug', message);
};

const info = function info(message) {
  logger.log('info', message);
};

const warn = function warn(message) {
  logger.log('warn', message);
};

const error = function error(message) {
  logger.log('error', message);
};

const log = logger;

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

const { stream } = logger;

export default {
  debug,
  info,
  warn,
  error,
  stream,
  log,
};
