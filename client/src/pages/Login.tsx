import React, { useState, useEffect } from 'react';
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
        // Send a POST request to the local Express backend
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }), // Convert state to JSON payload
        });

        // Parse the JSON response from the server
        const data = await response.json();

        // If the response is successful (status 200-299) and contains a token
        if (response.ok && data.token) {
          // Save the JWT token to localStorage for persistent sessions
          localStorage.setItem('token', data.token);
          // Redirect the user to the home page
          navigate('/home');
        } else {
          // Display the error returned by the server or a default message
          setErrorMessage(data.error || 'Invalid credentials');
        }
      } catch (error) {
        // Handle network errors or server downtime
        setErrorMessage('Error connecting to the server');
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
            className="mt-2 p-3 rounded-lg bg-[#0457CB] hover:bg-[#1877f2] text-white font-semibold text-sm cursor-pointer transition-colors shadow-md"
          >
            Log In
          </button>
        </form>

        {/* Navigation link to the Registration page */}
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