import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import streamRoutes from './routes/streams.js';
import channelRoutes from './routes/channels.js';
import dashboardRoutes from './routes/dashboard.js';
import { initSocket } from './socket.js';
import videoRoutes, { UPLOAD_DIR } from './routes/videos.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', streamRoutes);
app.use('/api', channelRoutes);
app.use('/api', dashboardRoutes);
app.use('/uploads', express.static(UPLOAD_DIR));
app.use('/api', videoRoutes);

const server = http.createServer(app);
initSocket(server);

await mongoose.connect(process.env.MONGO_URI);
const port = process.env.PORT || 5000;
server.listen(port, () => console.log('Server running on port', port));
