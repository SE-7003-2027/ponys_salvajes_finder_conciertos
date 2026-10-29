import React, { useState, useEffect } from 'react';
import { postJson } from '../services/http';
import { useNavigate, Link } from 'react-router-dom';
import { TextField } from '../components/TextField';

export function Login() {
  // State hooks to manage form inputs and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Hook to programmatically navigate between routes
  const navigate = useNavigate();

  // Lifecycle hook for session persistence: 
  // Redirects to Home immediately if a session token already exists in the browser
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  // Function to handle standard email/password form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default page reload on form submit
    setErrorMessage(''); // Clears any previous error messages

    // Ensure both fields are filled before sending the request
    if (email && password) {
      try {
        const data = await postJson<{ token: string }>('/api/login', { email, password });
        localStorage.setItem('token', data.token);
        navigate('/home');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Invalid credentials');
      }
    }
  };

  // Function to handle Spotify OAuth redirection
  const handleSpotifyLogin = () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = 'http://127.0.0.1:5173/spotify/callback';
    const scope = 'user-read-private user-read-email user-top-read';
    
    // Construct the Spotify authorization URL
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    
    // Redirect the user to the Spotify login page
    window.location.href = authUrl;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white font-sans p-4">
      <div className="bg-surface border border-line text-white p-8 rounded-xl shadow-2xl w-full max-w-sm flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center tracking-tight">Log In 🐴</h2>

        {/* Standard Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {errorMessage && (
            <p className="text-red-400 text-xs text-center font-medium">{errorMessage}</p>
          )}

          <TextField
            id="email"
            label="Email address"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={setEmail}
          />

          <TextField
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
          />

          <button
            type="submit"
            className="mt-2 p-3 rounded-lg bg-brand hover:bg-brand-hover text-white font-semibold text-sm cursor-pointer transition-colors shadow-md"
          >
            Log In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 border-t border-line"></div>
          <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">or</span>
          <div className="flex-1 border-t border-line"></div>
        </div>

        {/* Spotify Login Button */}
        <button
          onClick={handleSpotifyLogin}
          className="w-full p-3 rounded-lg bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-sm cursor-pointer transition-colors shadow-md flex justify-center items-center gap-2"
        >
          Continue with Spotify
        </button>

        {/* Navigation link to the Registration page */}
        <div className="border-t border-line pt-4 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand hover:text-sky-400 font-semibold transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}