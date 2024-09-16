import React, { useState } from 'react';
import InfoPopup from './shared/InfoPopup';
import LogoutAllButton from './LogoutAllButton';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const AccountSettings = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userSecretKey, setUserSecretKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [oldSecretKey, setOldSecretKey] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newSecretKey, setNewSecretKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');



  const token = localStorage.getItem('token');




  const handleChangeUsername = async (e) => {
    e.preventDefault();

    try {
      const secretKey = userSecretKey
      const response = await fetch(`${BASE_URL}/api/user/change-username`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ secretKey, newUsername }),
      });

      if (response.ok) {
        setMessage('Username changed successfully');
        setNewUsername('');
        setUserSecretKey('');
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to change username');
      }
    } catch (err) {
      setError('An error occurred while changing username');
    }
  };



  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/user/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ secretKey, newPassword: password }),
      });

      if (response.ok) {
        setMessage('Password changed successfully');
        setPassword('');
        setConfirmPassword('');
        setSecretKey('');
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to change password');
      }
    } catch (err) {
      setError('An error occurred while changing password');
    }
  };




  const handleChangeSecretKey = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/user/change-secretkey`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldSecretKey, newSecretKey }),
      });

      if (response.ok) {
        setMessage('Secret key changed successfully');
        setOldSecretKey('');
        setNewSecretKey('');
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to change secret key');
      }
    } catch (err) {
      setError('An error occurred while changing secret key');
    }
  };












  return (
    <div className="ml-48 mt-28 flex flex-col items-center space-y-8">

      <div className='mx-auto flex items-center justify-center'>
                  <LogoutAllButton />
      </div>
      {/* Change Username Form */}
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Change Username</h2>
        <form onSubmit={handleChangeUsername} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secret Key
            </label>
            <input
              type="text"
              value={userSecretKey}
              onChange={(e) => setUserSecretKey(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Username
            </label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="mt-7 min-w-full rounded-md border-2 border-blue-300 bg-gradient-to-l from-blue-300 to-blue-200 px-4 py-2 font-bold text-gray-800 hover:scale-105 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none active:text-black"
          >
            Change Username
          </button>
        </form>
      </div>






      {/* Change Password Form */}
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secret Key
            </label>
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="mt-7 min-w-full rounded-md border-2 border-blue-300 bg-gradient-to-l from-blue-300 to-blue-200 px-4 py-2 font-bold text-gray-800 hover:scale-105 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none active:text-black"
          >
            Change Password
          </button>
        </form>
      </div>




      {/* Change Secret Key Form */}
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <div className='flex items-center justify-between mr-2 gap-2 mb-4'>
          <h2 className="text-2xl font-semibold mb-">Change Secret Key</h2>
          <div className='mt-2'>
            <InfoPopup text="The secret key which you set up is crucial for resetting your username and password. Please make sure to remember it, as it cannot be recovered if forgotten." />
          </div>

        </div>
        <form onSubmit={handleChangeSecretKey} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Old Secret Key
            </label>
            <input
              type="text"
              value={oldSecretKey}
              onChange={(e) => setOldSecretKey(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Secret Key
            </label>
            <input
              type="text"
              value={newSecretKey}
              onChange={(e) => setNewSecretKey(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="mt-7 min-w-full rounded-md border-2 border-blue-300 bg-gradient-to-l from-blue-300 to-blue-200 px-4 py-2 font-bold text-gray-800 hover:scale-105 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none active:text-black"
          >
            Change Secret Key
          </button>
        </form>
      </div>







      {(message || error) && (
        <div className='sticky bottom-10 right-auto left-auto bg-blue-200 rounded-xl min-w-[400px] pb-3 flex flex-col items-center justify-center shadow-xl border-2 border-blue-300'>
          {message && <p className="text-green-500 mt-4">{message}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      )}

    </div>
  );
};

export default AccountSettings;
