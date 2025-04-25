import express from 'express';
import dotenv from 'dotenv';
import morganConfig from '../config/morgan-config.js';

dotenv.config();

export default function expressLoader(app) {
  app.use(express.json());
  app.use(morganConfig);
  app.get('/', (req, res) => res.send('✅ API funcionando correctamente'));
}
