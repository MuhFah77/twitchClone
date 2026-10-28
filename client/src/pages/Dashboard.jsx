import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { getAuth } from '../auth.js';
import UploadVideo from '../components/UploadVideo.jsx';

export default function Dashboard() {
  const { token, username } = getAuth();
  const [data, setData] = useState(null);
  const [title, setTitle] = useState('');
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (token) api('/dashboard').then((d) => { setData(d); setTitle(d.title); }).catch((e) => setMsg(e.message));
  }, [token]);

  if (!token) return <div className="form"><Link to="/auth">Log in to open your dashboard</Link></div>;
  if (!data) return <div className="page">{msg || 'Loading...'}</div>;

  const saveTitle = async () => { await api('/dashboard/title', { method: 'PUT', body: { title } }); setMsg('Title saved'); };
  const makeKey = async () => {
    try { setData({ ...data, ...(await api('/dashboard/key', { method: 'POST' })) }); setMsg(''); }
    catch (e) { setMsg(e.message); }
  };

  return (
    <div className="page">
      <h2>Creator dashboard</h2>

      <div className="card">
        <h3>Stream title</h3>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What are you streaming?" />{' '}
        <button onClick={saveTitle}>Save</button>
      </div>
      <UploadVideo />
      <div className="card">
        <h3>Stream key</h3>
        {data.streamKey ? (
          <>
            <p>Server URL</p><code className="key">{data.ingressUrl}</code>
            <p>Stream key</p>
            <code className="key">{show ? data.streamKey : '••••••••••••••••'}</code>{' '}
            <button className="ghost" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>{' '}
            <button className="ghost" onClick={makeKey}>Reset key</button>
            <ol>
              <li>OBS → Settings → Stream → Service: <b>Custom</b></li>
              <li>Paste the Server URL and Stream key, then press OK</li>
              <li>Click <b>Start Streaming</b>, then open <Link to={`/c/${username}`}>your channel</Link></li>
            </ol>
          </>
        ) : (
          <button onClick={makeKey}>Generate stream key</button>
        )}
        {msg && <p className="err">{msg}</p>}
        <small>Never share your stream key.</small>
      </div>
    </div>
  );
}
