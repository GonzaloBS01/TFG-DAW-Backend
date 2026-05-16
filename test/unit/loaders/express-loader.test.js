jest.mock('swagger-ui-express', () => ({
  __esModule: true,
  default: {
    serve: jest.fn(),
    setup: jest.fn(),
  },
}));

jest.mock('cors', () => {
  const m = (opts) => {
    m._opts = opts;
    return () => {};
  };
  return m;
});

jest.mock('../../../src/config/morgan-config.js', () => ({ __esModule: true, default: (req, res, next) => next() }));
jest.mock('../../../src/openapi/index.js', () => ({ __esModule: true, default: { swagger: 'spec' } }));
jest.mock('../../../src/router/index.js', () => ({ __esModule: true, default: (req, res) => {} }));
jest.mock('../../../src/middlewares/error-handler.js', () => ({ __esModule: true, errorMiddleware: (err, req, res, next) => next(err) }));

import expressLoader from '../../../src/loaders/express-loader.js';
import swaggerUi from 'swagger-ui-express';

describe('express-loader', () => {
  let app;

  beforeEach(() => {
    app = { use: jest.fn(), get: jest.fn() };
    jest.clearAllMocks();
  });

  it('registra middlewares y rutas', () => {
    expressLoader(app);

    expect(app.use).toHaveBeenCalled();
    expect(app.get).toHaveBeenCalledWith('/', expect.any(Function));
    expect(app.get).toHaveBeenCalledWith('/health', expect.any(Function));
    // Verify that /api/docs was registered with swagger serve middleware
    const docsCall = app.use.mock.calls.find(c => c[0] === '/api/docs');
    expect(docsCall).toBeDefined();
    expect(docsCall[1]).toBe(swaggerUi.serve);
    expect(app.use).toHaveBeenCalledWith('/api/v1', expect.anything());
  });

  it('ruta raíz responde status ok', () => {
    expressLoader(app);
    // encontrar el handler del primer get con path '/'
    const handler = app.get.mock.calls.find(c => c[0] === '/')[1];
    const req = {};
    const statusReturn = { json: jest.fn() };
    const res = { status: jest.fn(() => statusReturn), json: jest.fn() };

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(statusReturn.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'ok' }));
  });

  it('cors origin callback rechaza orígenes no permitidos', () => {
    expressLoader(app);
    const cors = require('cors');
    const originFn = cors._opts.origin;
    const cb = jest.fn();

    originFn('http://evil.com', cb);

    expect(cb).toHaveBeenCalled();
    expect(cb.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});
