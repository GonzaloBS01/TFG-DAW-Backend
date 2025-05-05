import morgan from 'morgan';
import logger from '../utils/logger.js';

function createMorganMiddleware(logger) {
  morgan.token('date', () => {
    const dateISO = new Date().toISOString();
    const dateArray = dateISO.split('.');
    const date = dateArray[0].replace('T', ' ');
    return date;
  });

  morgan.token('level', () => '\x1b[32minfo\x1b[0m');
  morgan.format('combined', '(routes) [:method] :status :url');

  return morgan('combined', {
    skip(_req, res) {
      return res.statusCode >= 400;
    },
    stream: logger.stream,
  });
}

const morganMiddleware = createMorganMiddleware(logger);

export default morganMiddleware;
