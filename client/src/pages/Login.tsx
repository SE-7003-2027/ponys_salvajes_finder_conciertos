import React, { useState, useEffect } from 'react';
import { postJson } from '../services/http';
import { useNavigate, Link } from 'react-router-dom';

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
      <div className="bg-[#121212] border border-[#262626] text-white p-8 rounded-xl shadow-2xl w-full max-w-sm flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center tracking-tight">Log In 🐴</h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Conditionally render the error message if it exists */}
          {errorMessage && (
            <p className="text-red-400 text-xs text-center font-medium">{errorMessage}</p>
          )}

          {/* Email Input Field */}
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="email" className="text-xs text-gray-400 font-medium">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update state on keystroke
              required
              className="p-3 rounded-lg border border-[#262626] bg-[#1a1a1a] text-white text-sm focus:outline-none focus:border-gray-500 placeholder-gray-600 transition-all"
            />
          </div>

          {/* Password Input Field */}
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="password" className="text-xs text-gray-400 font-medium">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update state on keystroke
              required
              className="p-3 rounded-lg border border-[#262626] bg-[#1a1a1a] text-white text-sm focus:outline-none focus:border-gray-500 placeholder-gray-600 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 p-3 rounded-lg bg-brand hover:bg-brand-hover text-white font-semibold text-sm cursor-pointer transition-colors shadow-md"
          >
            Log In
          </button>
        </form>

        {/* Navigation link to the Registration page */}
        <div className="border-t border-[#262626] pt-4 text-center">
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
