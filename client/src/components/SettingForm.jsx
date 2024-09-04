import React, { useState, useEffect } from 'react';
import LoadingSkeleton2 from './LoadingSkeletons/LoadingSkeleton2';

const SettingForm = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    companyName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    url: '',
    taxRate: '8.5',
    imageUrl: ''
  });
  const [file, setFile] = useState(null); // New state for the image file
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    // Fetch current settings when the component mounts
    fetchSettings();
  }, []);

  const removePublicPrefix = (path) => {
    let url = path.replace('public', '');
    return url.replace('\\', '');
  };

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await fetch(`${BASE_URL}/api/settings`, {
        headers: {
          'Authorization': `Bearer ${token}` // Include token in header
        }
      });
            
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();

      const cleanedPath = removePublicPrefix(data.imageUrl);

      setSettings({
        companyName: data.companyName || '',
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        url: data.url || '',
        taxRate: data.taxRate || '',
        imageUrl: cleanedPath || ''
      });

      console.log(cleanedPath);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Set the selected file
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('companyName', settings.companyName);
      formData.append('phoneNumber', settings.phoneNumber);
      formData.append('address', settings.address);
      formData.append('city', settings.city);
      formData.append('state', settings.state);
      formData.append('country', settings.country);
      formData.append('url', settings.url);
      formData.append('taxRate', settings.taxRate);
      if (file) {
        formData.append('image', file); // Append the image file
      }

      await fetch(`${BASE_URL}/api/settings/upload`, {
        // Update URL to match image upload endpoint
        method: 'PUT',
        body: formData
      });
      alert('Settings updated successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="ml-56 mt-28">
      <div className="mx-auto my-5 max-w-lg rounded-lg border-2 border-solid border-[#f1f1f1] border-b-slate-300 border-l-[#d1e4f5] border-r-[#d1e4f5] bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-2xl font-semibold">Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-10">
            {loading && (
              <div className="min-w-[500px]">
                <LoadingSkeleton2 />
                <LoadingSkeleton2 />
              </div>
            )}
            {!loading && (
              <div className="flex gap-14">
                <div className="flex flex-col gap-6">
                  <label>
                    <span className="text-gray-700">Company Name:</span>
                    <input type="text" name="companyName" value={settings.companyName} onChange={handleChange} className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:outline-none" />
                  </label>
                  <label>
                    <span className="text-gray-700">Phone Number:</span>
                    <input type="text" name="phoneNumber" value={settings.phoneNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:outline-none" />
                  </label>
                  <label>
                    <span className="text-gray-700">Address:</span>
                    <input type="text" name="address" value={settings.address} onChange={handleChange} className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:outline-none" />
                  </label>
                  <label>
                    <span className="text-gray-700">City:</span>
                    <input type="text" name="city" value={settings.city} onChange={handleChange} className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:outline-none" />
                  </label>
                </div>
                <div className="flex flex-col gap-6">
                  <label>
                    <span className="text-gray-700">State:</span>
                    <input type="text" name="state" value={settings.state} onChange={handleChange} className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:outline-none" />
                  </label>
                  <label>
                    <span className="text-gray-700">Country:</span>
                    <input type="text" name="country" value={settings.country} onChange={handleChange} className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:outline-none" />
                  </label>
                  <label>
                    <span className="text-gray-700">URL:</span>
                    <input type="text" name="url" value={settings.url} onChange={handleChange} className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:outline-none" />
                  </label>
                  <label>
                    <span className="text-gray-700">Tax Rate:</span>
                    <input type="number" name="taxRate" value={settings.taxRate} onChange={handleChange} className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:outline-none" />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* New field for image upload */}
          <div className="mt-6">
            <label>
              <span className="text-gray-700">Upload Logo:</span> <span className="text-sm text-red-400">{`(jpeg format, 55x25)`}</span>
              <input type="file" onChange={handleFileChange} className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-500 focus:outline-none" />
            </label>
            {settings.imageUrl && (
              <div className="mt-4">
                <img src={`${BASE_URL}/${settings.imageUrl}`} alt="Setting Image" className="h-auto w-full rounded-md border" />
              </div>
            )}
          </div>
          <div className="mt- w-full">
            <button type="submit" className="mt-7 min-w-full rounded-md border-2 border-blue-300 bg-gradient-to-l from-blue-300 to-blue-200 px-4 py-2 font-bold text-gray-800 hover:scale-105 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none active:text-black">
              Update
            </button>
          </div>
        </form>
      </div>
      <div className="h-[50vh]"></div>
    </div>
  );
};

export default SettingForm;
