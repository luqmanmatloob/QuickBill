import React, { useState, useEffect } from 'react';

const SettingForm = () => {
  const [settings, setSettings] = useState({
    companyName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    url: ''
  });
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    // Fetch current settings when the component mounts
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/settings`);
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      // Set the settings from the fetched data
      setSettings({
        companyName: data.companyName || '',
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        url: data.url || ''
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await fetch(`${BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <label>
            <span className="text-gray-700">Company Name:</span>
            <input
              type="text"
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
            />
          </label>
          <label>
            <span className="text-gray-700">Phone Number:</span>
            <input
              type="text"
              name="phoneNumber"
              value={settings.phoneNumber}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
            />
          </label>
          <label>
            <span className="text-gray-700">Address:</span>
            <input
              type="text"
              name="address"
              value={settings.address}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
            />
          </label>
          <label>
            <span className="text-gray-700">City:</span>
            <input
              type="text"
              name="city"
              value={settings.city}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
            />
          </label>
          <label>
            <span className="text-gray-700">State:</span>
            <input
              type="text"
              name="state"
              value={settings.state}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
            />
          </label>
          <label>
            <span className="text-gray-700">Country:</span>
            <input
              type="text"
              name="country"
              value={settings.country}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
            />
          </label>
          <label>
            <span className="text-gray-700">URL:</span>
            <input
              type="text"
              name="url"
              value={settings.url}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
            />
          </label>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingForm;
