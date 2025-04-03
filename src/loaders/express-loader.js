import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

export default function expressLoader(app) {
    app.use(express.json());

    app.get('/', (req, res) => res.send('✅ API funcionando correctamente'));
}
