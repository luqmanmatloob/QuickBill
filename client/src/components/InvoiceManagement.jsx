import React, { useState } from 'react';

const InvoiceManagement = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [file, setFile] = useState(null);
    
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful:', data);
        // Handle success, e.g., show a success message
      } else {
        console.error('Upload failed:', response.statusText);
        // Handle failure, e.g., show an error message
      }
    } catch (error) {
      console.error('Error occurred during upload:', error);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div className="container mx-auto mt-8 p-8 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default InvoiceManagement;
