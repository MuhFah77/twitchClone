import { Router } from 'express';
import crypto from 'crypto';
import { AccessToken } from 'livekit-server-sdk';
import User from '../models/User.js';
import Follow from '../models/Follow.js';
import { livekit } from '../config/livekit.js';
import { getLive } from '../services/live.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/channel/:username', optionalAuth, async (req, res) => {
  const user = await User.findOne({ username: req.params.username.toLowerCase() }).select('username title');
  if (!user) return res.status(404).json({ error: 'Channel not found' });
  const live = await getLive();
  const [followers, isFollowing] = await Promise.all([
    Follow.countDocuments({ following: user._id }),
    req.user ? Follow.exists({ follower: req.user.id, following: user._id }) : null,
  ]);
  res.json({
    username: user.username, title: user.title, followers, isFollowing: !!isFollowing,
    live: user.username in live, viewers: live[user.username] ?? 0,
  });
});

// Viewer token: subscribe-only access to the channel's room
router.get('/channel/:username/token', optionalAuth, async (req, res) => {
  const room = req.params.username.toLowerCase();
  if (!(await User.exists({ username: room }))) return res.status(404).json({ error: 'Channel not found' });
  const name = req.user?.username || 'guest';
  const at = new AccessToken(livekit.key, livekit.secret, {
    identity: `${name}-${crypto.randomBytes(3).toString('hex')}`, name, ttl: '2h',
  });
  at.addGrant({ room, roomJoin: true, canSubscribe: true, canPublish: false, canPublishData: false });
  res.json({ token: await at.toJwt(), url: livekit.url });
});

router.post('/follow/:username', requireAuth, async (req, res) => {
  const target = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!target) return res.status(404).json({ error: 'Channel not found' });
  if (target._id.equals(req.user.id)) return res.status(400).json({ error: "You can't follow yourself" });
  await Follow.updateOne({ follower: req.user.id, following: target._id }, {}, { upsert: true });
  res.json({ isFollowing: true });
});

router.delete('/follow/:username', requireAuth, async (req, res) => {
  const target = await User.findOne({ username: req.params.username.toLowerCase() });
  if (target) await Follow.deleteOne({ follower: req.user.id, following: target._id });
  res.json({ isFollowing: false });
});

export default router;
