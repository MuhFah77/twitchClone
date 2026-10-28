import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api.js';
import Player from '../components/Player.jsx';
import Chat from '../components/Chat.jsx';
import FollowButton from '../components/FollowButton.jsx';
import VideoCard from '../components/VideoCard.jsx';

export default function Channel() {
  const { channel } = useParams();
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(
    () => api(`/channel/${channel}`).then(setInfo).catch((e) => setError(e.message)), [channel]);

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  const [videos, setVideos] = useState([]);
  const loadVideos = useCallback(
    () => api(`/channel/${channel}/videos`).then(setVideos).catch(() => {}), [channel]);
  useEffect(() => { loadVideos(); }, [loadVideos]);
  const removeVideo = async (id) => { await api(`/videos/${id}`, { method: 'DELETE' }); loadVideos(); };

  if (error) return <div className="page"><h2>{error}</h2></div>;
  if (!info) return <div className="page">Loading...</div>;

  return (
    <div className="page watch">
      <div>
        <Player channel={channel} />
        <div className="meta">
          <div>
            <h3>{info.live && <span className="live">LIVE</span>} {info.username}</h3>
            <h3>Videos</h3>
            {!videos.length && <p>No videos yet.</p>}
            <div className="grid">
              {videos.map((v) => <VideoCard key={v.id} video={v} onDelete={removeVideo} />)}
            </div>
            <p>{info.title || 'No title'}</p>
            <small>{info.followers} followers{info.live && ` · ${info.viewers} watching`}</small>
          </div>
          <FollowButton channel={channel} isFollowing={info.isFollowing} onChange={load} />
        </div>
      </div>
      <Chat channel={channel} />
    </div>
  );
}
