import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import Channel from './pages/Channel.jsx';
import Dashboard from './pages/Dashboard.jsx';
import VideoPage from './pages/VideoPage.jsx';


export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/c/:channel" element={<Channel />} />
        <Route path="/v/:id" element={<VideoPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}
