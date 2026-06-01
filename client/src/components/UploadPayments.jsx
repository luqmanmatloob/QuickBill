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
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="rounded-2xl border border-[#E4E7EB] bg-white p-6 lg:p-8 shadow-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-4">
          <input type="file" accept=".csv" onChange={handleFileChange} className="w-full rounded-lg border-2 border-[#E4E7EB] px-4 py-2.5 text-[#0F172A] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-200 outline-none" />
          <button onClick={handleParseAndSubmit} className="rounded-lg bg-[#059669] px-6 py-2.5 font-semibold text-white hover:bg-[#047857] transition-colors duration-200">
            Upload
          </button>
        </div>
      </div>

        <div className="rounded-2xl border border-[#E4E7EB] bg-white p-6 lg:p-8 shadow-lg">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-[#0F172A]">Payments</h1>
            <div>
              <button onClick={handleToggle} className="rounded-lg px-4 py-2 font-semibold text-[#2563EB] hover:text-[#1E3A5F] transition-colors duration-200">
                File Format?
              </button>
              {toggleUploadPaymentsInstructions &&
                <div className="mt-4">
                  <UploadPaymentsInstructions>
                    <button onClick={handleToggle} className="rounded-lg border-2 border-[#2563EB] px-4 py-2 font-semibold text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors duration-200">
                      X
                    </button>
                  </UploadPaymentsInstructions>
                </div>}
            </div>
          </div>
          {successMessage && <div className="mb-4 rounded-xl bg-[#F8FAFC] px-6 py-4 text-center text-[#059669]">{successMessage}</div>}
          {errorMessage && <div className="mb-4 rounded-xl bg-[#F8FAFC] px-6 py-4 text-center text-red-500">{errorMessage}</div>}
          {loading && <div className="mb-4 rounded-xl bg-[#F8FAFC] px-6 py-4 text-center text-[#64748B]">Processing payments...</div>}

          {/* Successful uploads table */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-[#0F172A]">Successful Uploads</h2>
            <div className="overflow-x-auto rounded-xl border-2 border-[#E4E7EB]">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    <th className="border-b border-[#E4E7EB] px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">Order Number</th>
                    <th className="border-b border-[#E4E7EB] px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {successfulUploads.map((payment, index) => (
                    <tr key={index} className={`border-t border-[#E4E7EB] hover:bg-[#F8FAFC] transition-colors duration-200 ${index % 2 === 0 ? '' : 'bg-[#F8FAFC]'}`}>
                      <td className="px-4 py-3 text-sm text-[#0F172A]">{payment.orderNumber}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-[#059669]">Uploaded successfully</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Failed uploads table */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-[#0F172A]">Unsuccessful Uploads</h2>
            <div className="overflow-x-auto rounded-xl border-2 border-[#E4E7EB]">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    <th className="border-b border-[#E4E7EB] px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">Order Number</th>
                    <th className="border-b border-[#E4E7EB] px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">Error Message</th>
                  </tr>
                </thead>
                <tbody>
                  {failedUploads.map((failed, index) => (
                    <tr key={index} className={`border-t border-[#E4E7EB] hover:bg-[#F8FAFC] transition-colors duration-200 ${index % 2 === 0 ? '' : 'bg-[#F8FAFC]'}`}>
                      <td className="px-4 py-3 text-sm text-[#0F172A]">{failed.orderNumber}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-red-500">{failed.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
};

export default UploadPayments;
