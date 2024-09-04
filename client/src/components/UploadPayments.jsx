import React, { useState } from 'react';
import Papa from 'papaparse';
import UploadPaymentsInstructions from './UploadPaymentsInstructions';

const UploadPayments = () => {
  
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  const [file, setFile] = useState(null);
  const [successfulUploads, setSuccessfulUploads] = useState([]);
  const [failedUploads, setFailedUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const [toggleUploadPaymentsInstructions, setToggleUploadPaymentsInstructions] = useState(false);

  function handleToggle() {
    if (toggleUploadPaymentsInstructions) {
      setToggleUploadPaymentsInstructions(false);
    } else {
      setToggleUploadPaymentsInstructions(true);
    }
  }







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
            const filteredData = result.data.filter((row) => Object.values(row).some((value) => value !== ''));
            resolve(filteredData);
          },
          error: (error) => {
            reject(error);
          }
        });
      });

      // Group data by Order Number
      const groupedData = {};
      parsedData.forEach((row) => {
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
              'Authorization': `Bearer ${token}` // Include token in header

            },
            body: JSON.stringify(paymentData)
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
      console.log(successfulUploads);
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
          'Authorization': `Bearer ${token}` // Include token in header

        },
        body: JSON.stringify({ orderNumber })
      });

      if (!response.ok) {
        throw new Error('Failed to delete payments');
      }

      setSuccessfulUploads(successfulUploads.filter((payment) => payment.orderNumber !== orderNumber));
    } catch (error) {
      console.error('Error deleting payments:', error);
      alert('Failed to delete payments');
    }
  };

  return (
    <div className="ml-56 mt-28">
      <div className="m-10 mb-[70vh]">
        <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center rounded-md border-2 border-[#f1f1f1] border-b-[#c2d6e7] border-t-[#c2d6e7] bg-white p-4 py-8 shadow-xl">
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button onClick={handleParseAndSubmit} className="rounded-md border-2 border-blue-300 bg-gradient-to-r from-blue-300 to-blue-200 px-8 py-2 font-bold text-black hover:scale-105 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none active:text-black">
            Upload
          </button>
        </div>

        <div className="mt-20 rounded-md border-2 border-[#f1f1f1] border-l-[#c5d9eb] border-r-[#c5d9eb] p-5 shadow-2xl">
          <div className="mb-5 flex w-full items-center justify-between">
            <h1 className="font-Josefin-Sans text-3xl font-bold text-[#3952ac]">Payments</h1>
            <div className='mr-5'>
                <button onClick={handleToggle} className='rounded-md  py-2  font-semibold text-blue-400 underline hover:text-blue-500'>
                  File Format?
                </button>

                {/* Conditional rendering */}
                {toggleUploadPaymentsInstructions &&
                  <div>
                    <UploadPaymentsInstructions>
                      <button onClick={handleToggle} className='rounded-md border-2 border-blue-300 bg-gradient-to-r from-blue-300 to-blue-200 px-4 py-2 font-bold text-black hover:scale-105 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none active:text-black
                '>
                        X
                      </button>
                    </UploadPaymentsInstructions>
                  </div>}
              </div>

          </div>
          {successMessage && <div className="my-4 rounded bg-green-200 px-4 py-2 text-green-800">{successMessage}</div>}
          {errorMessage && <div className="my-4 rounded bg-red-200 px-4 py-2 text-red-800">{errorMessage}</div>}
          {loading && <div className="my-4 rounded bg-green-200 px-4 py-2 text-yellow-800">Processing payments...</div>}

          {/* Successful uploads table */}
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-semibold">Successful Uploads</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-blue-200">
                <thead className="rounded-lg">
                  <tr className="rounded-md bg-blue-100 py-20">
                    <th className="border-b px-4 py-2">Order Number</th>
                    <th className="border-b px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {successfulUploads.map((payment, index) => (
                    <tr key={index} className={`bg-white text-center ${index % 2 === 0 ? '' : 'bg-[#f1f1f1]'}`}>
                      <td className="border-b px-4 py-2">{payment.orderNumber}</td>
                      <td className="border-b px-4 py-2 text-green-600">Uploaded successfully</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Failed uploads table */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Unsuccessful Uploads</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-red-200">
                <thead className="rounded-lg">
                  <tr className="rounded-md bg-red-100 py-20">
                    <th className="border-b px-4 py-2">Order Number</th>
                    <th className="border-b px-4 py-2">Error Message</th>
                  </tr>
                </thead>
                <tbody>
                  {failedUploads.map((failed, index) => (
                    <tr key={index} className={`bg-white text-center ${index % 2 === 0 ? '' : 'bg-[#f1f1f1]'}`}>
                      <td className="border-b px-4 py-2">{failed.orderNumber}</td>
                      <td className="border-b px-4 py-2 text-red-600">{failed.error}</td>
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
