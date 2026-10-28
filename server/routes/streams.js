import { Router } from 'express';
import User from '../models/User.js';
import Follow from '../models/Follow.js';
import { getLive } from '../services/live.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// All live channels, most viewers first
router.get('/streams', async (_req, res) => {
  const live = await getLive();
  const users = await User.find({ username: { $in: Object.keys(live) } }).select('username title');
  res.json(users.map((u) => ({ username: u.username, title: u.title, viewers: live[u.username] }))
    .sort((a, b) => b.viewers - a.viewers));
});

// Channels the logged-in user follows
router.get('/following', requireAuth, async (req, res) => {
  const follows = await Follow.find({ follower: req.user.id }).populate('following', 'username');
  const live = await getLive();
  res.json(follows.map((f) => ({ username: f.following.username, live: f.following.username in live })));
});

export default router;
