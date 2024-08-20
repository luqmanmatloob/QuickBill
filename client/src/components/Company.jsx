import React, { useState, useEffect } from 'react';
import LoadingSkeleton2 from './LoadingSkeletons/LoadingSkeleton2';

const Company = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    companyName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    url: '',
    imageUrl: ''
  });

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

      // Set the settings from the fetched data
      setSettings({
        companyName: data.companyName || '',
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        url: data.url || '',
        imageUrl: cleanedPath || ''
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  return (
    <div className="print-no-py print-no-my p-4">
      {loading && (
        // <div className="my-4 bg-green-200 text-green-800 py-2 px-4 rounded">
        //   Loading...
        // </div>
        <div className="min-w-[300px]">
          <LoadingSkeleton2 />
        </div>
      )}

      {settings.imageUrl && (
        <div className="">
          <img src={`${BASE_URL}/${settings.imageUrl}`} alt="Setting Image" className="h-auto max-w-[250px] rounded-md border" />
        </div>
      )}

      <h2 className="mb-4 text-[1.75rem] font-bold text-blue-400">{settings.companyName}</h2>
      <div className="print-text-10px flex flex-col space-y-2">
        {!loading && (
          <>
            <p>
              {settings.companyName} - {settings.phoneNumber}
            </p>
            <p> {settings.address}</p>
            <p>
              {settings.city}, {settings.state}
            </p>
          </>
        )}

        <p>{settings.country}</p>
        {/* <p><a href={settings.url} target='_blank' className="text-blue-500">{settings.url}</a></p> */}
        <p className="">{settings.url}</p>
      </div>
    </div>
  );
};

export default Company;
