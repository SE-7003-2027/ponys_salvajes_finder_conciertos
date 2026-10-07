import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
        // Send registration data to the backend API via POST request
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firstName, lastName, email, password }), // Payload mapping
        });

        // Parse server response
        const data = await response.json();

        if (response.ok) {
          // Display success view by updating the state flag if account was created
          setIsRegistered(true);
        } else {
          // Show specific error from server (e.g., "Email already exists")
          setErrorMessage(data.error || 'Error registering account');
        }
      } catch (error) {
        // Fallback error for network issues
        setErrorMessage('Error connecting to the server');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white font-sans p-4">
      <div className="bg-[#121212] border border-[#262626] text-white p-8 rounded-xl shadow-2xl w-full max-w-sm flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center tracking-tight">Create Account 🐴</h2>

        {/* Conditional Rendering: Show success message if registration is complete */}
        {isRegistered ? (
          <div className="text-center flex flex-col gap-4 py-2">
            <p className="text-emerald-400 font-semibold text-sm">Account created successfully!</p>
            <p className="text-xs text-gray-400">Please log in with your credentials.</p>
            {/* Button to manually navigate the user back to the login screen */}
            <button 
              onClick={() => navigate('/')} 
              className="mt-2 p-3 rounded-lg bg-[#0457CB] hover:bg-[#1877f2] text-white font-semibold text-sm cursor-pointer transition-colors"
            >
              Go to Log In
            </button>
          </div>
        ) : (
          /* Conditional Rendering: Show the form if not yet registered */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Render error message dynamically */}
            {errorMessage && (
              <p className="text-red-400 text-xs text-center font-medium">{errorMessage}</p>
            )}

            <div className="flex gap-4">
              {/* First Name Input */}
              <div className="flex flex-col gap-1.5 text-left w-1/2">
                <label htmlFor="firstName" className="text-xs text-gray-400 font-medium">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)} // Bind input to state
                  required
                  className="p-3 rounded-lg border border-[#262626] bg-[#1a1a1a] text-white text-sm focus:outline-none focus:border-gray-500 placeholder-gray-600 transition-all w-full"
                />
              </div>

              {/* Last Name Input */}
              <div className="flex flex-col gap-1.5 text-left w-1/2">
                <label htmlFor="lastName" className="text-xs text-gray-400 font-medium">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)} // Bind input to state
                  required
                  className="p-3 rounded-lg border border-[#262626] bg-[#1a1a1a] text-white text-sm focus:outline-none focus:border-gray-500 placeholder-gray-600 transition-all w-full"
                />
              </div>
            </div>

            {/* Email Input */}
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

            {/* Password Input */}
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

            {/* Submit Registration Button */}
            <button
              type="submit"
              className="mt-2 p-3 rounded-lg bg-[#0457CB] hover:bg-[#1877f2] text-white font-semibold text-sm cursor-pointer transition-colors shadow-md"
            >
              Sign Up
            </button>
          </form>
        )}

        {/* Hide the login link if the user has successfully registered */}
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