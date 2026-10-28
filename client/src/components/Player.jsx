import { useEffect, useRef, useState } from 'react';
import { Room, RoomEvent } from 'livekit-client';
import { api } from '../api.js';

// Joins the channel's LiveKit room as a subscribe-only viewer and plays the streamer's tracks.
export default function Player({ channel }) {
  const video = useRef();
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    const room = new Room();
    let closed = false;

    const attach = (track) => { track.attach(video.current); setStatus(''); };
    room.on(RoomEvent.TrackSubscribed, attach);
    room.on(RoomEvent.TrackUnsubscribed, (track) => { track.detach(); setStatus('Streamer is offline'); });
    room.on(RoomEvent.Disconnected, () => !closed && setStatus('Disconnected'));

    (async () => {
      try {
        const { token, url } = await api(`/channel/${channel}/token`);
        await room.connect(url, token);
        if (closed) return room.disconnect();
        let found = false;
        room.remoteParticipants.forEach((p) =>
          p.trackPublications.forEach((pub) => { if (pub.track) { attach(pub.track); found = true; } }));
        if (!found) setStatus('Streamer is offline');
      } catch (err) {
        setStatus(err.message || 'Could not connect');
      }
    })();

    return () => { closed = true; room.disconnect(); };
  }, [channel]);

  return (
    <div className="player">
      <video ref={video} autoPlay playsInline controls muted />
      {status && <div className="overlay">{status}</div>}
    </div>
  );
}
