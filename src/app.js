import express from 'express';
import config from './config';

const app = express();

init(app, config);
export default app;
