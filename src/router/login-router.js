import express from 'express';
import { logIn, recoverPassword, signIn } from '../controllers/login-controller.js';

const router = express.Router();

router.post('/signin', signIn);

router.post('/login', logIn);

router.post('/recoverPass', recoverPassword);

export default router;
