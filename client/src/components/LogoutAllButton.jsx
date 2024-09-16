import React from 'react';
import InfoPopup from './shared/InfoPopup';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const LogoutAllButton = () => {
  const token = localStorage.getItem('token');

  const handleLogoutAll = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/logoutalldevices`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        alert('Logged out from all devices.');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error logging out from all devices:', error);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <div className='display flex gap-2 items-center'>
      <button 
      onClick={handleLogoutAll}
      className="min-w-full rounded-md border-2 border-blue-300 bg-gradient-to-l from-blue-300 to-blue-200 px-4 py-2 font-bold text-gray-800 hover:scale-105 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none active:text-black"
      >
        Logout All
      </button>
      <InfoPopup text="This will log you out from all the devices where you are currently logged in" />
    </div>
  );
};

export default LogoutAllButton;
