import { Link, useNavigate } from 'react-router-dom';
import { getAuth, clearAuth } from '../auth.js';

export default function Nav() {
  const nav = useNavigate();
  const { token, username } = getAuth();
  return (
    <nav>
      <Link to="/" className="logo">StreamClone</Link>
      {token ? (
        <>
          <Link to="/dashboard">Creator dashboard</Link>
          <Link to={`/c/${username}`}>{username}</Link>
          <button className="ghost" onClick={() => { clearAuth(); nav('/'); location.reload(); }}>Logout</button>
        </>
      ) : (
        <Link to="/auth">Login / Sign up</Link>
      )}
    </nav>
  );
}
