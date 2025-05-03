import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock database (replace with your database logic)
const users = [];

// Sign Up
export async function signIn(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully.' });
};

// Log In
export async function logIn(req, res) {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1h' });
  res.status(200).json({ message: 'Login successful.', token });
};

// Recover Password
export async function recoverPassword(req, res) {
  const { username } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  // Mock password recovery logic (replace with actual implementation)
  res.status(200).json({ message: 'Password recovery instructions sent to your email.' });
};
