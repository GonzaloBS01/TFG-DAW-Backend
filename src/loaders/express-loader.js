import express from 'express';
import dotenv from 'dotenv';
import morganConfig from '../config/morgan-config.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../config/swagger-config.js';
import userRouter from '../routes/user-router.js';
import productRouter from '../routes/product-router.js';
import billRouter from '../routes/bill-router.js';
import loginRouter from '../routes/login-router.js';

dotenv.config();

export default function expressLoader(app) {
  app.use(express.json());
  app.use(morganConfig);

  // Documentación Swagger
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Rutas
  app.use('/api/users', userRouter);
  app.use('/api/products', productRouter);
  app.use('/api/bills', billRouter);
  app.use('/api/auth', loginRouter);

  app.get('/', (req, res) => res.send('API funcionando correctamente'));
}
