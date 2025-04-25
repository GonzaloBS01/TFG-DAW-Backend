import winston from 'winston';
const { format } = winston;

const {
  combine, timestamp, printf, colorize,
} = format;

const options = {
    console: {
      level: process.env.LOGGER_LEVEL || 'http',
      handleExceptions: true,
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize(),
        printf((info) => `[${info.timestamp}] ${info.level} ${info.message}`),
      ),
      silent: process.env.NODE_ENV === 'test',
    },
};

export default options;
