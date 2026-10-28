import { Link } from 'react-router-dom';
import { API } from '../config.js';
import { getAuth } from '../auth.js';

export default function VideoCard({ video, onDelete }) {
  const mine = getAuth().username === video.owner;
  return (
    <div className="card">
      <Link to={`/v/${video.id}`}>
        <video className="thumb" src={`${API}${video.url}#t=0.5`} preload="metadata" muted />
        <b>{video.title}</b>
      </Link>
      <p><Link to={`/c/${video.owner}`}>{video.owner}</Link></p>
      <small>{new Date(video.createdAt).toLocaleDateString()}</small>
      {mine && onDelete && <> <button className="ghost" onClick={() => onDelete(video.id)}>Delete</button></>}
    </div>
  );
}