import React, { useState } from 'react';
import Papa from 'papaparse';

const UploadPayments = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [file, setFile] = useState(null);
  const [successfulUploads, setSuccessfulUploads] = useState([]);
  const [failedUploads, setFailedUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleParseAndSubmit = async () => {
    setLoading(true);
    if (!file) {
      alert('No file selected');
      setLoading(false);
      return;
    }

    try {
      const parsedData = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const filteredData = result.data.filter(row => Object.values(row).some(value => value !== ''));
            resolve(filteredData);
          },
          error: (error) => {
            reject(error);
          }
        });
      });

      // Group data by Order Number
      const groupedData = {};
      parsedData.forEach(row => {
        const orderNumber = row['Order Number'];
        if (!groupedData[orderNumber]) {
          groupedData[orderNumber] = [];
        }
        groupedData[orderNumber].push({
          datePaid: new Date(row['Date Paid']),
          orderPaymentAmount: parseFloat(row['Order Payment Amount']),
          paymentMethod: row['Payment Method']
        });
      });

      const results = [];
      const failedResults = [];

      for (const [orderNumber, payments] of Object.entries(groupedData)) {
        const paymentData = {
          orderNumber,
          payments
        };

        try {
          const response = await fetch(`${BASE_URL}/api/invoicequote/updatePayments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
          });

          if (!response.ok) {
            // Handle non-200 status codes
            const errorData = await response.json();
            failedResults.push({ orderNumber, error: errorData.message });
          } else {
            const responseData = await response.json();
            results.push(responseData);
          }
        } catch (error) {
          // Handle fetch errors
          console.error('Fetch error:', error);
          failedResults.push({ orderNumber, error: 'Network or server error' });
        }
      }

      // Update the state with results
      setSuccessfulUploads(results);
      setFailedUploads(failedResults);
      setSuccessMessage('Payments processed successfully!');
    } catch (error) {
      console.error('Error during processing:', error);
      setErrorMessage('Failed to process the file and submit payments.');
    } finally {
      setLoading(false);
      console.log(successfulUploads)

    }
  };

  const handleDelete = async (orderNumber) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete payments for order number ${orderNumber}?`);
    if (!isConfirmed) {
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/invoicequote/deletePayments`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderNumber }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete payments');
      }

      setSuccessfulUploads(successfulUploads.filter(payment => payment.orderNumber !== orderNumber));
    } catch (error) {
      console.error('Error deleting payments:', error);
      alert('Failed to delete payments');
    }
  };


  return (
    <div className="ml-56 mt-28">
      <div className="m-10 mb-[70vh]">
        <div className='flex items-center justify-center max-w-3xl mx-auto mt-8 p-4 bg-white shadow-xl rounded-md border-2 py-8 border-[#f1f1f1] border-t-[#c2d6e7] border-b-[#c2d6e7]'>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
          <button
            onClick={handleParseAndSubmit}
            className="py-2 bg-gradient-to-r from-blue-300 to-blue-200 border-2 border-blue-300 active:text-black text-black font-bold rounded-md hover:scale-105 px-8 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Upload
          </button>
        </div>

        <div className="mt-20 shadow-2xl p-5 border-2 border-[#f1f1f1] border-r-[#c5d9eb] border-l-[#c5d9eb] rounded-md">
          <div className='flex items-center justify-between mb-5'>
            <h1 className="text-3xl font-bold font-Josefin-Sans text-[#3952ac]">Payments</h1>
            <div>
            </div>
          </div>
          {successMessage && (
            <div className="my-4 bg-green-200 text-green-800 py-2 px-4 rounded">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="my-4 bg-red-200 text-red-800 py-2 px-4 rounded">
              {errorMessage}
            </div>
          )}
          {loading && (
            <div className="my-4 bg-yellow-200 text-yellow-800 py-2 px-4 rounded">
              Processing payments...
            </div>
          )}

          {/* Successful uploads table */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Successful Uploads</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-blue-200">
                <thead className='rounded-lg'>
                  <tr className='bg-blue-100 rounded-md py-20'>
                    <th className="py-2 px-4 border-b">Order Number</th>
                    <th className="py-2 px-4 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {successfulUploads.map((payment, index) => (
                    <tr key={index} className={`bg-white text-center ${index % 2 === 0 ? '' : 'bg-[#f1f1f1]'}`}>
                      <td className="py-2 px-4 border-b">{payment.orderNumber}</td>
                      <td className="py-2 px-4 border-b text-green-600">Uploaded successfully</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Failed uploads table */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Failed Uploads</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-red-200">
                <thead className='rounded-lg'>
                  <tr className='bg-red-100 rounded-md py-20'>
                    <th className="py-2 px-4 border-b">Order Number</th>
                    <th className="py-2 px-4 border-b">Error Message</th>
                  </tr>
                </thead>
                <tbody>
                  {failedUploads.map((failed, index) => (
                    <tr key={index} className={`bg-white text-center ${index % 2 === 0 ? '' : 'bg-[#f1f1f1]'}`}>
                      <td className="py-2 px-4 border-b">{failed.orderNumber}</td>
                      <td className="py-2 px-4 border-b text-red-600">{failed.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPayments;


