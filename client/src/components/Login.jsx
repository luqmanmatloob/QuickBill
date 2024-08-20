import React, { useState } from 'react';

const AuthComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const register = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Error registering user');
      }

      alert('User registered');
    } catch (error) {
      console.error(error);
      alert('Error registering user');
    }
  };

  const login = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Error logging in');
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem('token', data.token);
      alert('User logged in');
    } catch (error) {
      console.error(error);
      alert('Error logging in');
    }
  };

  const changePassword = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, oldPassword: password, newPassword })
      });

      if (!response.ok) {
        throw new Error('Error changing password');
      }

      alert('Password changed');
    } catch (error) {
      console.error(error);
      alert('Error changing password');
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    alert('User logged out');
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold">Auth Component</h2>
      <div className="space-y-4">
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded border border-gray-300 p-2" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border border-gray-300 p-2" />
        <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded border border-gray-300 p-2" />
        <div className="flex flex-col space-y-2">
          <button onClick={register} className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Register
          </button>
          <button onClick={login} className="w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
            Login
          </button>
          <button onClick={changePassword} className="w-full rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600">
            Change Password
          </button>
          <button onClick={logout} className="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
