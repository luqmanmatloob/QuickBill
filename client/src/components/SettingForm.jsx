import React, { useState, useEffect } from 'react';
import LoadingSkeleton2 from './LoadingSkeletons/LoadingSkeleton2';

const SettingForm = () => {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token'); 

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
        headers: {
          'Authorization': `Bearer ${token}`
        },
        
        body: formData
      });
      alert('Settings updated successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border-2 border-[#6D8196] bg-[#F8FAFC] p-6 lg:p-8 shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-[#384959]">Settings</h2>
        <form onSubmit={handleSubmit}>
          {loading && (
            <div className="space-y-4">
              <LoadingSkeleton2 />
              <LoadingSkeleton2 />
            </div>
          )}
          {!loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-[#384959] mb-2">
                  Company Name:
                </label>
                <input type="text" name="companyName" value={settings.companyName} onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#384959] mb-2">
                  Phone Number:
                </label>
                <input type="text" name="phoneNumber" value={settings.phoneNumber} onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#384959] mb-2">
                  Address:
                </label>
                <input type="text" name="address" value={settings.address} onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#384959] mb-2">
                  City:
                </label>
                <input type="text" name="city" value={settings.city} onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#384959] mb-2">
                  State:
                </label>
                <input type="text" name="state" value={settings.state} onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#384959] mb-2">
                  Country:
                </label>
                <input type="text" name="country" value={settings.country} onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#384959] mb-2">
                  URL:
                </label>
                <input type="text" name="url" value={settings.url} onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#384959] mb-2">
                  Tax Rate:
                </label>
                <input type="number" name="taxRate" value={settings.taxRate} onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
              </div>
            </div>
          )}

          {/* New field for image upload */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-[#384959] mb-2">
              Upload Logo: <span className="text-sm font-normal text-red-400">(jpeg format, 55x25)</span>
            </label>
            <input type="file" onChange={handleFileChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
            {settings.imageUrl && (
              <div className="mt-4">
                <img src={`${BASE_URL}/${settings.imageUrl}`} alt="Company Logo" className="h-auto w-full rounded-xl border-2 border-[#6D8196]" />
              </div>
            )}
          </div>
          <div className="mt-6">
            <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-[#6A89A7] to-[#88BDF2] px-6 py-2.5 font-semibold text-white hover:from-[#88BDF2] hover:to-[#6A89A7] transition-colors duration-200">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingForm;
