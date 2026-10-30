import React, { useState } from 'react';
import { postJson } from '../services/http';
import { useNavigate, Link } from 'react-router-dom';
import { TextField } from '../components/TextField';

export function Register() {
  // State hooks for form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State hooks for UI management (success view and error handling)
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Hook to navigate to different routes
  const navigate = useNavigate();

  // Function triggered when the registration form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload
    setErrorMessage(''); // Clears previous errors

    // Validate that all fields contain data before making the API call
    if (firstName && lastName && email && password) {
      try {
        await postJson('/api/register', { firstName, lastName, email, password });
        setIsRegistered(true);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Error registering account');
      }
    }
  };

  // Handler to redirect the user to Spotify for registration/login
  const handleSpotifyRegister = () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = 'http://127.0.0.1:5173/spotify/callback';
    const scope = 'user-read-private user-read-email user-top-read';
    
    // Construct Spotify OAuth URL
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    
    window.location.href = authUrl;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white font-sans p-4">
      <div className="bg-surface border border-line text-white p-8 rounded-xl shadow-2xl w-full max-w-sm flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center tracking-tight">Create Account 🐴</h2>

        {/* Conditional Rendering: Show success message if registration is complete */}
        {isRegistered ? (
          <div className="text-center flex flex-col gap-4 py-2">
            <p className="text-emerald-400 font-semibold text-sm">Account created successfully!</p>
            <p className="text-xs text-gray-400">Please log in with your credentials.</p>
            {/* Button to manually navigate the user back to the login screen */}
            <button
              onClick={() => navigate('/')}
              className="mt-2 p-3 rounded-lg bg-brand hover:bg-brand-hover text-white font-semibold text-sm cursor-pointer transition-colors"
            >
              Go to Log In
            </button>
          </div>
        ) : (
          /* Conditional Rendering: Show the form if not yet registered */
          <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {errorMessage && (
                <p className="text-red-400 text-xs text-center font-medium">{errorMessage}</p>
              )}

              <div className="flex gap-4">
                <TextField
                  id="firstName"
                  label="First Name"
                  placeholder="John"
                  value={firstName}
                  onChange={setFirstName}
                  className="w-1/2"
                />
                <TextField
                  id="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={setLastName}
                  className="w-1/2"
                />
              </div>

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
                Sign Up
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 border-t border-line"></div>
              <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">or</span>
              <div className="flex-1 border-t border-line"></div>
            </div>

            {/* Spotify Sign Up Button */}
            <button
              onClick={handleSpotifyRegister}
              className="w-full p-3 rounded-lg bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-sm cursor-pointer transition-colors shadow-md flex justify-center items-center gap-2"
            >
              Sign up with Spotify
            </button>
          </>
        )}

        {/* Hide the login link if the user has successfully registered */}
        {!isRegistered && (
          <div className="border-t border-line pt-4 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/" className="text-brand hover:text-sky-400 font-semibold transition-colors">
                Log in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}