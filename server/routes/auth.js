import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../utils/token.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!/^[a-z0-9_]{3,20}$/i.test(username || '') || (password || '').length < 6)
      return res.status(400).json({ error: 'Username 3-20 chars (letters, numbers, _), password 6+ chars' });
    const user = await User.create({ username: username.toLowerCase(), password: await bcrypt.hash(password, 10) });
    res.json({ token: signToken(user), username: user.username });
  } catch {
    res.status(400).json({ error: 'Username already taken' });
  }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: (req.body.username || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: signToken(user), username: user.username });
});

export default router;
