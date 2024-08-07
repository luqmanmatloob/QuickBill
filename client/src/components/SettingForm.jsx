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
      const response = await fetch(`${BASE_URL}/api/settings`);
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

      console.log(cleanedPath)
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

      await fetch(`${BASE_URL}/api/settings/upload`, { // Update URL to match image upload endpoint
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
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-2xl p-8 my-5 border-b-slate-300 border-solid border-2 border-[#f1f1f1] border-r-[#d1e4f5] border-l-[#d1e4f5]">
        <h2 className="text-2xl font-semibold mb-6">Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-10 flex-wrap">
            {loading && (
              <div className='min-w-[500px]'>
                <LoadingSkeleton2 />
                <LoadingSkeleton2 />
              </div>
            )}
            {!loading && (
              <div className='flex gap-14'>
                <div className='flex flex-col gap-6'>
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
                </div>
                <div className='flex flex-col gap-6'>
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
                  <label>
                    <span className="text-gray-700">Tax Rate:</span>
                    <input
                      type="number"
                      name="taxRate"
                      value={settings.taxRate}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                    />
                  </label>
                </div>
              </div>
            )}


          </div>

          {/* New field for image upload */}
          <div className="mt-6">
            <label>
              <span className="text-gray-700">Upload Logo:</span> <span className='text-red-400 text-sm'>{`(jpeg format, 55x25)`}</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
              />
           
            </label>
            {settings.imageUrl && (
              <div className="mt-4">
                <img
                  src={`${BASE_URL}/${settings.imageUrl}`}
                  alt="Setting Image"
                  className="w-full h-auto border rounded-md"
                />
              </div>
            )}
          </div>
          <div className="mt- w-full">


            <button
              type="submit"
              className="min-w-full mt-7 px-4 py-2 bg-gradient-to-l from-blue-300 to-blue-200 border-2 border-blue-300 active:text-black text-gray-800 font-bold rounded-md hover:scale-105 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
      <div className='h-[50vh]'></div>
    </div>
  );
};

export default SettingForm;
