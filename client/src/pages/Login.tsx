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

  // Function to handle form submission
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white font-sans p-4">
      <div className="bg-surface border border-line text-white p-8 rounded-xl shadow-2xl w-full max-w-sm flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center tracking-tight">Log In 🐴</h2>

        {/* Login Form */}
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
