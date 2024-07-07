import React, { useState } from 'react';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';

const Upload = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [file, setFile] = useState(null);
  const [uploadedInvoices, setUploadedInvoices] = useState([]);
  const [invoicesQuotes, setInvoicesQuotes] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleParseAndSubmit = async () => {
    if (!file) {
      alert('No file selected');
      return;
    }

    try {
      const parsedData = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const filteredData = result.data.filter(row => Object.values(row).some(value => value !== ''));

            const groupedData = {};
            filteredData.forEach(row => {
              const orderNumber = row['Order Number'];
              if (!groupedData[orderNumber]) {
                groupedData[orderNumber] = [];
              }
              groupedData[orderNumber].push(row);
            });

            const invoices = Object.values(groupedData);
            resolve(invoices);
          },
          error: (error) => {
            reject(error);
          }
        });
      });

      const uploadedUniqueKeys = [];

      for (let i = 0; i < parsedData.length; i++) {
        const items = parsedData[i].map(row => ({
          productName: row['Product Name'] || '',
          productCode: row['Product Code'] || '',
          size: row['Size'] || '',
          color: row['Color'] || '',
          lineQty: parseInt(row['Line Qty']) || 1,
          decorationProcess: row['Decoration Process'] || '',
          unitPrice: parseFloat(row['Unit Price']) || 0,
          lineTotal: parseFloat(row['Line Total']) || 0,
          tax: parseFloat(row['Tax']) || 0,
          taxExempt: row['Tax Exempt'] === 'true',
          orderShippingTotal: parseFloat(row['Order Shipping Total']) || 0,
          poNumber: row['PO Number'] || '',
          supplierPoNumber: row['Supplier PO Number'] || '',
          productionStaffAccount: row['Production Staff Account'] || '',
          storeName: row['Store Name'] || '',
          company: row['Company'] || '',
          billingFirstName: row['Billing First Name'] || '',
          billingLastName: row['Billing Last Name'] || '',
          billingEmailAddress: row['Billing Email Address'] || '',
          billingAddress: row['Billing Address'] || '',
          billingCity: row['Billing City'] || '',
          billingState: row['Billing State'] || '',
          billingPostcode: row['Billing Postcode/zip'] || '',
          billingPhoneNo: row['Billing Phone No.'] || '',
          shippingFirstName: row['Shipping First Name'] || '',
          shippingLastName: row['Shipping Last Name'] || '',
          shippingAddress: row['Shipping Address'] || '',
          shippingCity: row['Shipping City'] || '',
          shippingState: row['Shipping State'] || '',
          shippingPostcode: row['Shipping Postcode/zip'] || '',
          shippingPhoneNo: row['Shipping Phone No.'] || '',
          shippingMethod: row['Shipping Method'] || '',
          designName: row['Design Name'] || '',
          designPrice: parseFloat(row['Design Price']) || 0
        }));

        const invoiceData = {
          type: 'invoice',
          orderNumber: parsedData[i][0]['Order Number'] || '',
          dateOrdered: parsedData[i][0]['Date Ordered'] || '',
          dateDue: parsedData[i][0]['Date Due'] || '',
          orderTotal: parseFloat(parsedData[i][0]['Order Total']) || 0,
          billingCity: parsedData[i][0]['Billing City'] || '',
          billingAddress: parsedData[i][0]['Billing Address'] || '',
          billingState: parsedData[i][0]['Billing State'] || '',
          shippingAddress: parsedData[i][0]['Shipping Address'] || '',
          shippingCity: parsedData[i][0]['Shipping City'] || '',
          shippingMethod: parsedData[i][0]['Shipping Method'] || '',
          shippingState: parsedData[i][0]['Shipping State'] || '',
          shippingPostcode: parsedData[i][0]['Shipping Postcode/zip'] || '',
          items: items,
          note: ''
        };

        console.log('Invoice Data:', invoiceData);

        const response = await fetch(`${BASE_URL}/api/invoicequote/createInvoiceQuote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(invoiceData),
        });

        if (!response.ok) {
          throw new Error(`Failed to upload invoice ${i + 1}`);
        }

        const result = await response.json();
        uploadedUniqueKeys.push(result.invoiceOrQuote.uniqueKey);
        console.log(`Invoice ${i + 1} submitted successfully`);
      }

      fetchUploadedInvoices(uploadedUniqueKeys);
    } catch (error) {
      console.error('Error during processing:', error);
      alert('Failed to process the file and submit invoices');
    }
  };

  const fetchUploadedInvoices = async (uniqueKeys) => {
    try {
      const response = await fetch(`${BASE_URL}/api/invoicequote/getInvoicesByUniqueKeys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uniqueKeys }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch uploaded invoices');
      }

      const fetchedInvoices = await response.json();
      setInvoicesQuotes(fetchedInvoices); // Update state with fetched invoices
    } catch (error) {
      console.error('Error fetching uploaded invoices:', error);
      alert('Failed to fetch uploaded invoices');
    }
  };

  const handleDelete = async (uniqueKey) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete this item?`);
    if (!isConfirmed) {
      return; // If the user cancels, do nothing
    }
    try {
      const response = await fetch(`${BASE_URL}/api/invoicequote/deleteInvoiceQuote`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uniqueKey }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete data');
      }
      setInvoicesQuotes(invoicesQuotes.filter(item => item.uniqueKey !== uniqueKey)); // Update state after deletion
    } catch (error) {
      console.error('Error deleting invoice/quote:', error);
      alert('Failed to delete invoice/quote');
    }
  };

  const [success, setSuccess] = useState('');

  const handleSave = () => {
    // Simulate saving data (you can replace this with actual API call or other logic)
    setTimeout(() => {
      setSuccess('Saved successfully!');
    }, 1000); // Assuming saving takes 1 second

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess('');
    }, 3000); // Show success message for 3 seconds
  };

  // Function to format date into readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const cancel = async () => {
    const isConfirmed = window.confirm(`Are you sure you want to delete all uploaded invoices?`);
    if (!isConfirmed) {
      return; // If the user cancels, do nothing
    }
    try {
      const uniqueKeys = invoicesQuotes.map(invoice => invoice.uniqueKey);
      const response = await fetch(`${BASE_URL}/api/invoicequote/deleteMultipleInvoices`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uniqueKeys }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete all uploaded invoices');
      }
      setInvoicesQuotes([]); // Clear the state after deletion
    } catch (error) {
      console.error('Error deleting all uploaded invoices:', error);
      alert('Failed to delete all uploaded invoices');
    }
  };
  

  return (
    <div className="m-10 mb-[70vh]">
      <div className='flex items-center justify-center max-w-3xl mx-auto mt-8 p-4 bg-white shadow-xl border-2 rounded-md'>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className=""
        />
        <button
          onClick={handleParseAndSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
        >
          OK
        </button>
      </div>

      <div className="mt-20">
        <div className='flex items-center justify-between mb-5'>
          <h1 className="text-3xl font-bold">Invoices/Quotes</h1>
          <div >
            <button onClick={cancel} className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-3">
              Cancel
            </button>
            <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Save All
            </button>
          </div>
        </div>
        {success && (
          <div className="mt-4 bg-green-200 text-green-800 py-2 px-4 rounded">
            {success}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Unique Key</th>
                <th className="py-2 px-4 border-b">Order Number</th>
                <th className="py-2 px-4 border-b">Date Ordered</th>
                <th className="py-2 px-4 border-b">Date Due</th>
                <th className="py-2 px-4 border-b">Order Total</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoicesQuotes.map((invoice) => (
                <tr key={invoice.uniqueKey}>
                  <td className="py-2 px-4 border-b">{invoice.uniqueKey}</td>
                  <td className="py-2 px-4 border-b">{invoice.orderNumber}</td>
                  <td className="py-2 px-4 border-b">{formatDate(invoice.dateOrdered)}</td>
                  <td className="py-2 px-4 border-b">{formatDate(invoice.dateDue)}</td>
                  <td className="py-2 px-4 border-b">${invoice.orderTotal.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleDelete(invoice.uniqueKey)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Delete
                    </button>


                    <Link to={`/Edit/${invoice.uniqueKey}`} target="_blank" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">Edit</Link>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default Upload;
