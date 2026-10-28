import { roomService } from '../config/livekit.js';

// A channel is live when its streamer (identity === room name) is in the room with a published track.
// Returns { username: viewerCount }. Cached for 3s so polling clients don't hammer LiveKit.
let cache = { at: 0, data: {} };

export async function getLive() {
  if (Date.now() - cache.at < 3000) return cache.data;
  const data = {};
  try {
    const rooms = await roomService.listRooms();
    await Promise.all(rooms.map(async (room) => {
      const people = await roomService.listParticipants(room.name);
      if (people.some((p) => p.identity === room.name && p.tracks.length)) data[room.name] = people.length - 1;
    }));
  } catch (err) {
    console.error('LiveKit error:', err.message);
  }
  cache = { at: Date.now(), data };
  return data;
}
