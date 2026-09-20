import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (name && email && password) {
      setIsRegistered(true);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white font-sans p-4">
      <div className="bg-[#121212] border border-[#262626] text-white p-8 rounded-xl shadow-2xl w-full max-w-sm flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center tracking-tight">Create Account 🐴</h2>

        {isRegistered ? (
          <div className="text-center flex flex-col gap-4 py-2">
            <p className="text-emerald-400 font-semibold text-sm">Account created successfully!</p>
            <p className="text-xs text-gray-400">Please log in with your credentials.</p>
            <button 
              onClick={() => navigate('/')} 
              className="mt-2 p-3 rounded-lg bg-[#0457CB] hover:bg-[#1877f2] text-white font-semibold text-sm cursor-pointer transition-colors"
            >
              Go to Log In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="name" className="text-xs text-gray-400 font-medium">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="p-3 rounded-lg border border-[#262626] bg-[#1a1a1a] text-white text-sm focus:outline-none focus:border-gray-500 placeholder-gray-600 transition-all"
              />
            </div>

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
              Sign Up
            </button>
          </form>
        )}

        {!isRegistered && (
          <div className="border-t border-[#262626] pt-4 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/" className="text-[#0457CB] hover:text-sky-400 font-semibold transition-colors">
                Log in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}