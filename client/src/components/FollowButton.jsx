import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { getAuth } from '../auth.js';

export default function FollowButton({ channel, isFollowing, onChange }) {
  const nav = useNavigate();
  const { token, username } = getAuth();
  if (username === channel) return null;

  const toggle = async () => {
    if (!token) return nav('/auth');
    await api(`/follow/${channel}`, { method: isFollowing ? 'DELETE' : 'POST' });
    onChange();
  };

  return <button className={isFollowing ? 'ghost' : ''} onClick={toggle}>{isFollowing ? 'Unfollow' : 'Follow'}</button>;
}
