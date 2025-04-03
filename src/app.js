import express from 'express';
import config from './config.js';
import init from './loaders/index.js';

const app = express();

init(app);
export default app;
