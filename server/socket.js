import { Server } from 'socket.io';
import { verifyToken } from './utils/token.js';

// Chat only. Video goes through LiveKit.
export function initSocket(httpServer) {
  const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL } });

  io.use((socket, next) => {
    socket.user = verifyToken(socket.handshake.auth.token);
    next();
  });

  io.on('connection', (socket) => {
    socket.on('join', (channel) => socket.join(String(channel).toLowerCase()));

    socket.on('chat', ({ channel, text }) => {
      if (!socket.user || !text?.trim() || !socket.rooms.has(channel)) return;
      io.to(channel).emit('chat', { user: socket.user.username, text: text.slice(0, 300) });
    });
  });

  return io;
}
