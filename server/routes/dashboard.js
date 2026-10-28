import { Router } from 'express';
import { IngressInput } from 'livekit-server-sdk';
import User from '../models/User.js';
import { ingressClient } from '../config/livekit.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/dashboard', async (req, res) => {
  const u = await User.findById(req.user.id);
  res.json({ title: u.title, ingressUrl: u.ingressUrl, streamKey: u.streamKey });
});

router.put('/dashboard/title', async (req, res) => {
  const title = (req.body.title || '').slice(0, 100);
  await User.updateOne({ _id: req.user.id }, { title });
  res.json({ title });
});

// Create (or reset) the RTMP ingress that OBS publishes to
router.post('/dashboard/key', async (req, res) => {
  try {
    const u = await User.findById(req.user.id);
    if (u.ingressId) await ingressClient.deleteIngress(u.ingressId).catch(() => {});
    const ingress = await ingressClient.createIngress(IngressInput.RTMP_INPUT, {
      name: u.username, roomName: u.username, participantIdentity: u.username, participantName: u.username,
    });
    u.ingressId = ingress.ingressId;
    u.ingressUrl = ingress.url;
    u.streamKey = ingress.streamKey;
    await u.save();
    res.json({ ingressUrl: u.ingressUrl, streamKey: u.streamKey });
  } catch (err) {
    console.error('Ingress error:', err.message);
    res.status(500).json({ error: 'Could not create stream key. Check your LiveKit keys and that Ingress is available on your project.' });
  }
});

export default router;
