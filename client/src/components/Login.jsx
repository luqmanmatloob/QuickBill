// src/pages/LoginPage.js

import React, { useState } from 'react';
import InfoPopup from './shared/InfoPopup'

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle success (e.g., store token, redirect user)
        setSuccess('Login successful!');
        setError('');
        // Save token to localStorage or context
        localStorage.setItem('token', data.token);

        alert('loggedin successfully')

        setTimeout(() => {
          window.location.reload();
        }, 1000);





        // Redirect to a different page or perform further actions
      } else {
        setError(data.message || 'Login failed');
        setSuccess('');
      }
    } catch (error) {
      setError('An error occurred');
      setSuccess('');
    }
  };

  return (
    <div className="ml-48 mt-28 flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl border-gray-100 border-2">
        <div className='flex items-center justify-between mr-1'>
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <InfoPopup text="User name is case sensitive and Username must not contain any spaces." />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className=" w-full p-2 border-2 border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" w-full p-2 border-2 border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-7 min-w-full rounded-md border-2 border-blue-300 bg-gradient-to-l from-blue-300 to-blue-200 px-4 py-2 font-bold text-gray-800 hover:scale-105 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none active:text-black"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
