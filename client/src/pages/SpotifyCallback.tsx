import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function SpotifyCallback() {
  // Hooks for extracting URL query parameters and navigating
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // Ref to prevent double execution in React Strict Mode
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Extract OAuth parameters returned by Spotify
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state'); // Used to determine if the action is 'link' or 'login'

    // Handle user denying access on the Spotify consent screen
    if (error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrorMessage('Access denied by Spotify.');
      setTimeout(() => navigate(state === 'link' ? '/home' : '/login'), 3000);
      return;
    }

    // Redirect to login if no authorization code is present
    if (!code) {
      navigate('/login');
      return;
    }

    // Ensure the authentication process only runs once
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSpotifyAuth = async () => {
      try {
        const isLinking = state === 'link';
        // Determine the correct backend endpoint based on the flow
        const endpoint = isLinking ? '/api/spotify/link' : '/api/spotify/login';
        const currentToken = localStorage.getItem('token');

        // Set up request headers, injecting the JWT if linking an account requires auth
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (isLinking && currentToken) {
          headers['Authorization'] = `Bearer ${currentToken}`;
        }

        // Execute the API call to exchange the code for tokens and profile data
        const response = await fetch(`http://localhost:3000${endpoint}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Authentication failed');
        }

        if (isLinking) {
          // Redirect back to home after successfully linking the account
          navigate('/home');
        } else {
          // Store the new JWT session token and proceed to home on successful login
          localStorage.setItem('token', data.token);
          navigate('/home');
        }
      } catch (err) {
        // Handle and display any errors during the token exchange
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to authenticate with Spotify.'
        );
        setTimeout(() => navigate(state === 'link' ? '/home' : '/login'), 4000);
      }
    };

    processSpotifyAuth();
  }, [searchParams, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white font-sans p-4">
      <div className="bg-surface border border-line text-white p-8 rounded-xl shadow-2xl w-full max-w-sm flex flex-col items-center gap-4 text-center">
        {errorMessage ? (
          // Error UI state
          <>
            <div className="text-red-400 text-4xl mb-2">⚠️</div>
            <h2 className="text-xl font-bold">Authentication Failed</h2>
            <p className="text-sm text-gray-400">{errorMessage}</p>
            <p className="text-xs text-gray-500 mt-4">Redirecting...</p>
          </>
        ) : (
          // Loading UI state
          <>
            <div className="w-12 h-12 border-4 border-[#1DB954] border-t-transparent rounded-full animate-spin mb-2"></div>
            <h2 className="text-xl font-bold tracking-tight">Connecting to Spotify...</h2>
            <p className="text-sm text-gray-400">Please wait while we securely process your request.</p>
          </>
        )}
      </div>
    </div>
  );
}
