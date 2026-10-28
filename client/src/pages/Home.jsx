import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { getAuth } from '../auth.js';
import VideoCard from '../components/VideoCard.jsx';

export default function Home() {
  const [streams, setStreams] = useState([]);
  const [following, setFollowing] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const load = () => api('/streams').then(setStreams).catch(() => {});
    load();
    if (getAuth().token) api('/following').then(setFollowing).catch(() => {});
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
    api('/videos').then(setVideos).catch(() => {});
  }, []);

  return (
    <div className="page">
      {following.length > 0 && (
        <>
          <h2>Following</h2>
          <p>{following.map((f) => (
            <Link key={f.username} to={`/c/${f.username}`} className="chip">
              {f.live && <span className="live">LIVE</span>} {f.username}
            </Link>
          ))}</p>
        </>
      )}
      <h2>Live channels</h2>
      {!streams.length && <p>Nobody is live right now.</p>}
      <div className="grid">
        {streams.map((s) => (
          <Link key={s.username} to={`/c/${s.username}`} className="card">
            <span className="live">LIVE</span> <b>{s.username}</b>
            <p>{s.title || 'Untitled stream'}</p>
            <small>{s.viewers} watching</small>
          </Link>
        ))}
      </div>
      <h2>Latest videos</h2>
      {!videos.length && <p>No videos yet.</p>}
      <div className="grid">{videos.map((v) => <VideoCard key={v.id} video={v} />)}</div>
    </div>
    
  );
}
