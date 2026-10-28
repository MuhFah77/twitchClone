import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { API } from '../config.js';
import { getAuth } from '../auth.js';

export default function Chat({ channel }) {
  const [socket, setSocket] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const end = useRef();

  useEffect(() => {
    const s = io(API, { auth: { token: getAuth().token } });
    s.on('connect', () => s.emit('join', channel));
    s.on('chat', (m) => setMsgs((prev) => [...prev.slice(-200), m]));
    setSocket(s);
    return () => s.disconnect();
  }, [channel]);

  useEffect(() => end.current?.scrollIntoView(), [msgs]);

  const send = () => {
    if (!text.trim()) return;
    socket.emit('chat', { channel, text });
    setText('');
  };

  return (
    <div className="chat">
      <div className="msgs">
        {msgs.map((m, i) => <div key={i}><b>{m.user}</b>: {m.text}</div>)}
        <div ref={end} />
      </div>
      {getAuth().token ? (
        <input placeholder="Send a message" value={text}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
      ) : (
        <Link to="/auth">Log in to chat</Link>
      )}
    </div>
  );
}
