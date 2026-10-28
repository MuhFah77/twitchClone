import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { API } from '../config.js';

export default function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { api(`/videos/${id}`).then(setVideo).catch((e) => setError(e.message)); }, [id]);

  if (error) return <div className="page"><h2>{error}</h2></div>;
  if (!video) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <video src={`${API}${video.url}`} controls autoPlay playsInline />
      <h2>{video.title}</h2>
      <p>by <Link to={`/c/${video.owner}`}>{video.owner}</Link> · {new Date(video.createdAt).toLocaleDateString()}</p>
    </div>
  );
}