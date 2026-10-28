import { useState } from 'react';
import { upload } from '../api.js';

export default function UploadVideo() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [n, setN] = useState(0); // resets the file input after upload

  const submit = async () => {
    if (!file) return setMsg('Choose a video file');
    setBusy(true);
    setMsg('Uploading...');
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('video', file);
      await upload('/videos', form);
      setMsg('Uploaded! It now shows on your channel.');
      setTitle(''); setFile(null); setN(n + 1);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h3>Upload a video</h3>
      <input placeholder="Video title" value={title} onChange={(e) => setTitle(e.target.value)} />{' '}
      <input key={n} type="file" accept="video/mp4,video/webm" onChange={(e) => setFile(e.target.files[0])} />{' '}
      <button onClick={submit} disabled={busy}>{busy ? 'Uploading...' : 'Upload'}</button>
      {msg && <p>{msg}</p>}
      <small>MP4 (H.264) or WebM, up to 500 MB.</small>
    </div>
  );
}