import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (email && password) {
      navigate('/home');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white font-sans p-4">
      <div className="bg-[#121212] border border-[#262626] text-white p-8 rounded-xl shadow-2xl w-full max-w-sm flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center tracking-tight">Log In 🐴</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="email" className="text-xs text-gray-400 font-medium">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 rounded-lg border border-[#262626] bg-[#1a1a1a] text-white text-sm focus:outline-none focus:border-gray-500 placeholder-gray-600 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="password" className="text-xs text-gray-400 font-medium">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-3 rounded-lg border border-[#262626] bg-[#1a1a1a] text-white text-sm focus:outline-none focus:border-gray-500 placeholder-gray-600 transition-all"
            />
          </div>

          <button
            type="submit"
            className="mt-2 p-3 rounded-lg bg-[#0457CB] hover:bg-[#1877f2] text-white font-semibold text-sm cursor-pointer transition-colors shadow-md"
          >
            Log In
          </button>
        </form>

        <div className="border-t border-[#262626] pt-4 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#0457CB] hover:text-sky-400 font-semibold transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}