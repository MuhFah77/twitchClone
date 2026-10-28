import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import Video from '../models/Video.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

export const UPLOAD_DIR = fileURLToPath(new URL('../uploads', import.meta.url));
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) =>
      cb(null, crypto.randomBytes(12).toString('hex') + path.extname(file.originalname).toLowerCase()),
  }),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
  fileFilter: (_req, file, cb) => cb(null, ['video/mp4', 'video/webm'].includes(file.mimetype)),
}).single('video');

const shape = (v) => ({
  id: v._id, title: v.title, owner: v.owner.username, url: `/uploads/${v.filename}`, createdAt: v.createdAt,
});

const router = Router();

router.post('/videos', requireAuth, (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'File is too large (max 500 MB)' : 'Upload failed' });
    if (!req.file) return res.status(400).json({ error: 'Choose an MP4 or WebM file' });
    const video = await Video.create({
      owner: req.user.id, title: (req.body.title || 'Untitled').slice(0, 100), filename: req.file.filename,
    });
    await video.populate('owner', 'username');
    res.json(shape(video));
  });
});

router.get('/videos', async (_req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 }).limit(24).populate('owner', 'username');
  res.json(videos.map(shape));
});

router.get('/videos/:id', async (req, res) => {
  const video = await Video.findById(req.params.id).populate('owner', 'username').catch(() => null);
  if (!video) return res.status(404).json({ error: 'Video not found' });
  res.json(shape(video));
});

router.get('/channel/:username/videos', async (req, res) => {
  const owner = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!owner) return res.json([]);
  const videos = await Video.find({ owner: owner._id }).sort({ createdAt: -1 }).populate('owner', 'username');
  res.json(videos.map(shape));
});

router.delete('/videos/:id', requireAuth, async (req, res) => {
  const video = await Video.findById(req.params.id).catch(() => null);
  if (!video || !video.owner.equals(req.user.id)) return res.status(404).json({ error: 'Video not found' });
  fs.unlink(path.join(UPLOAD_DIR, video.filename), () => {});
  await video.deleteOne();
  res.json({ ok: true });
});

export default router;