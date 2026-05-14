import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { HttpStatusError } from 'common-errors';
import cors from 'cors';
import morganConfig from '../config/morgan-config.js';
import swaggerSpec from '../openapi/index.js';
import router from '../router/index.js';
import { errorMiddleware } from '../middlewares/error-handler.js';

dotenv.config();

export default function expressLoader(app) {
  const defaultAllowedOrigins = [
    'http://localhost:4200',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:4200',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'https://tfg-daw-frontend.vercel.app',
  ];

  const envAllowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];

  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
  }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(morganConfig);

  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'ok',
      message: 'TFG DAW Backend API',
      docs: '/api/docs',
      apiBase: '/api/v1',
      health: '/health',
    });
  });

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Documentación Swagger
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Rutas
  app.use('/api/v1', router);
  app.use((req, res, next) => {
    next(new HttpStatusError(404, 'Resource not found'));
  });
  app.use(errorMiddleware);
}
