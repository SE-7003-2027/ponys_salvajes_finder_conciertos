import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Artist } from './pages/Artist';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { SpotifyCallback } from './pages/SpotifyCallback';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/artist/:id" element={<Artist />} />
        <Route path="/login" element={<Login />} />
        
        {/* New route to handle the redirect from Spotify */}
        <Route path="/spotify/callback" element={<SpotifyCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;