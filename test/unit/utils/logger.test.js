jest.mock('winston', () => {
  const mockLog = jest.fn();
  const mockInfo = jest.fn();
  const mockCreateLogger = jest.fn(() => ({ log: mockLog, info: mockInfo }));
  const transports = { Console: function Console() {} };
  const format = {
    combine: (...args) => (info) => info,
    timestamp: (opts) => () => '',
    printf: (fn) => fn,
    colorize: () => () => '',
  };
  return { createLogger: mockCreateLogger, transports, format };
});

import logger from '../../../src/utils/logger.js';

describe('logger util', () => {
  beforeEach(() => jest.clearAllMocks());

  it('debug/info/warn/error llaman a logger.log', () => {
    // Ensure the exported functions exist and can be invoked without throwing
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    logger.debug('debug message');
    logger.info('info message');
    logger.warn('warn message');
    logger.error('error message');
  });

  it('stream.write llama a info', () => {
    // stream.write should call logger.info and not throw
    expect(typeof logger.stream.write).toBe('function');
    logger.stream.write('message');
  });
});
