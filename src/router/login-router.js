import express from 'express';

const router = express.Router();

router.post('/signin', (req, res) => {
  res.status(405).send('Sign-in route');
});

router.post('/login', (req, res) => {
  res.send('Login route');
});

router.post('/recoverPass', (req, res) => {
  res.send('Recover password route');
});

export default router;
