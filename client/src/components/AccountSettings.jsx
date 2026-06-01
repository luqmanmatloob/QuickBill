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
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex justify-center">
        <LogoutAllButton />
      </div>
      
      {/* Change Username Form */}
      <div className="rounded-2xl border-2 border-[#6D8196] bg-[#F8FAFC] p-6 lg:p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-[#384959]">Change Username</h2>
        <form onSubmit={handleChangeUsername} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#384959] mb-2">
              Secret Key
            </label>
            <input
              type="text"
              value={userSecretKey}
              onChange={(e) => setUserSecretKey(e.target.value)}
              required
              className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#384959] mb-2">
              New Username
            </label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
              className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-[#6A89A7] to-[#88BDF2] px-6 py-2.5 font-semibold text-white hover:from-[#88BDF2] hover:to-[#6A89A7] transition-colors duration-200"
          >
            Change Username
          </button>
        </form>
      </div>






      {/* Change Password Form */}
      <div className="rounded-2xl border-2 border-[#6D8196] bg-[#F8FAFC] p-6 lg:p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-[#384959]">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#384959] mb-2">
              Secret Key
            </label>
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
              className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#384959] mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#384959] mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-[#6A89A7] to-[#88BDF2] px-6 py-2.5 font-semibold text-white hover:from-[#88BDF2] hover:to-[#6A89A7] transition-colors duration-200"
          >
            Change Password
          </button>
        </form>
      </div>




      {/* Change Secret Key Form */}
      <div className="rounded-2xl border-2 border-[#6D8196] bg-[#F8FAFC] p-6 lg:p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-[#384959]">Change Secret Key</h2>
          <div>
            <InfoPopup text="The secret key which you set up is crucial for resetting your username and password. Please make sure to remember it, as it cannot be recovered if forgotten." />
          </div>
        </div>
        <form onSubmit={handleChangeSecretKey} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#384959] mb-2">
              Old Secret Key
            </label>
            <input
              type="text"
              value={oldSecretKey}
              onChange={(e) => setOldSecretKey(e.target.value)}
              required
              className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#384959] mb-2">
              New Secret Key
            </label>
            <input
              type="text"
              value={newSecretKey}
              onChange={(e) => setNewSecretKey(e.target.value)}
              required
              className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-[#6A89A7] to-[#88BDF2] px-6 py-2.5 font-semibold text-white hover:from-[#88BDF2] hover:to-[#6A89A7] transition-colors duration-200"
          >
            Change Secret Key
          </button>
        </form>
      </div>







      {(message || error) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl border-2 border-[#6D8196] bg-[#BDDDFC] p-4 shadow-xl">
          {message && <p className="text-sm font-medium text-[#88BDF2]">{message}</p>}
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        </div>
      )}

    </div>
  );
};

export default AccountSettings;
