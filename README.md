# StreamClone (MERN + LiveKit)

Streamers broadcast from OBS to a LiveKit RTMP ingress. Viewers watch through LiveKit (WebRTC). Chat runs on Socket.IO.

## Setup
1. Create a LiveKit project at https://cloud.livekit.io (or self-host). Copy the WebSocket URL, API key and secret.
   Make sure Ingress is available for your project.
2. Server:
   ```
   cd server && cp .env.example .env   # fill in MONGO_URI, JWT_SECRET and the three LIVEKIT_ values
   npm i && npm run dev
   ```
3. Client:
   ```
   cd client && cp .env.example .env && npm i && npm run dev
   ```
4. Open http://localhost:5173, sign up, go to **Creator dashboard**, generate a stream key.
5. In OBS: Settings → Stream → Service **Custom**, paste the Server URL and Stream key, Start Streaming.
6. Open the channel in another browser to watch (unmute with the video controls) and chat.

## Structure
```
server/
  index.js, socket.js (chat)
  config/livekit.js       LiveKit clients
  models/                 User, Follow
  middleware/auth.js      requireAuth, optionalAuth
  routes/                 auth, streams, channels (info, viewer token, follow), dashboard (stream key, title)
  services/live.js        asks LiveKit who is live and how many are watching
  utils/token.js          JWT helpers
client/src/
  pages/        Home, Auth, Channel, Dashboard
  components/   Nav, Player (livekit-client), Chat, FollowButton
  api.js, auth.js, config.js, style.css
```
