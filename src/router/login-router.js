import express from 'express';
import { logIn, recoverPassword, resetPassword, signIn } from '../controllers/login-controller.js';

const router = express.Router();

router.post('/signin', signIn);

router.post('/login', logIn);

router.post('/recoverPass', recoverPassword);

router.post('/resetPassword', resetPassword);

export default router;
