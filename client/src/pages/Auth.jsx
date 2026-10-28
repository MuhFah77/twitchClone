import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { saveAuth } from '../auth.js';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async () => {
    try {
      saveAuth(await api(`/${mode === 'login' ? 'login' : 'register'}`, { method: 'POST', body: form }));
      nav('/');
      location.reload();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="form">
      <h2>{mode === 'login' ? 'Log in' : 'Sign up'}</h2>
      <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {err && <span className="err">{err}</span>}
      <button onClick={submit}>{mode === 'login' ? 'Log in' : 'Create account'}</button>
      <button className="ghost" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'Need an account?' : 'Have an account?'}
      </button>
    </div>
  );
}
