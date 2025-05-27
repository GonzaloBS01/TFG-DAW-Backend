import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { HttpStatusError } from 'common-errors';

import morganConfig from '../config/morgan-config.js';
import swaggerSpec from '../openapi/index.js';
import router from '../router/index.js';
import { errorMiddleware } from '../middlewares/error-handler.js';

dotenv.config();

export default function expressLoader(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morganConfig);

  // Documentación Swagger
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Rutas
  app.use('/api/v1', router);
  app.use((req, res) => {
    errorMiddleware(new HttpStatusError(404, 'Resource not found'), req, res);
  });
}
