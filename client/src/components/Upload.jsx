

import React, { useState } from 'react';
import Papa from 'papaparse';

const Upload = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [csvData, setCsvData] = useState([]);
  const [file, setFile] = useState(null);

  // Function to handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    // Clear previous data when new file is selected
    setCsvData([]);
  };

  // Function to parse the CSV file
  const handleParse = () => {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file selected'));

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          // Filter out rows where all values are empty
          const filteredData = result.data.filter(row => Object.values(row).some(value => value !== ''));

          // Group data by Order Number
          const groupedData = {};
          filteredData.forEach(row => {
            const orderNumber = row['Order Number'];
            if (!groupedData[orderNumber]) {
              groupedData[orderNumber] = [];
            }
            groupedData[orderNumber].push(row);
          });

          // Convert grouped data into an array of invoices
          const invoices = Object.values(groupedData);

          // Set the state with grouped invoices
          setCsvData(invoices);
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  // Function to submit parsed invoices
  const handleSubmitInvoices = async () => {
    try {
      await handleParse(); // Wait for parsing to complete and csvData to be updated

      if (csvData.length === 0) {
        throw new Error('No valid data to submit');
      }

      for (let i = 0; i < csvData.length; i++) {
        const items = csvData[i].map(row => ({
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

        // Prepare formData for the current invoice
        const invoiceData = {
          type: 'invoice', // Assuming it's always an invoice based on formData initial state
          orderNumber: csvData[i][0]['Order Number'] || '',
          dateOrdered: csvData[i][0]['Date Ordered'] || '',
          dateDue: csvData[i][0]['Date Due'] || '',
          orderTotal: parseFloat(csvData[i][0]['Order Total']) || 0,
          billingCity: csvData[i][0]['Billing City'] || '',
          billingAddress: csvData[i][0]['Billing Address'] || '',
          billingState: csvData[i][0]['Billing State'] || '',
          shippingAddress: csvData[i][0]['Shipping Address'] || '',
          shippingCity: csvData[i][0]['Shipping City'] || '',
          shippingMethod: csvData[i][0]['Shipping Method'] || '',
          shippingState: csvData[i][0]['Shipping State'] || '',
          shippingPostcode: csvData[i][0]['Shipping Postcode/zip'] || '',
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

        console.log(`Invoice ${i + 1} submitted successfully`);
      }

      alert('All invoices submitted successfully');
    } catch (error) {
      console.error('Error submitting invoices:', error);
      alert('Failed to submit all invoices');
    }
  };

  return (
    <div className="m-10">
      {/* File input and Parse CSV button */}
      <div className='flex items-center justify-center max-w-3xl mx-auto mt-8 p-4 bg-white shadow-xl border-2 rounded-md'>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className=""
        />
        <button
          onClick={handleParse}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
        >
          Parse CSV
        </button>
      </div>

      {/* Button to submit parsed invoices */}
      <button
        onClick={handleSubmitInvoices}
        disabled={csvData.length === 0 || !file}
        className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Save Invoices
      </button>

      {/* Container for parsed CSV data table */}
      <div id="table-container" className="mt-4 overflow-x-auto overflow-y-auto" style={{ maxHeight: '80vh' }}>
        {csvData.length > 0 &&
          csvData.map((invoice, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-lg font-bold mb-2">Invoice #{index + 1}</h2>
              <table className='w-full table-auto'>
                <thead className='bg-gray-400 border-2 border-black'>
                  <tr className='text-center sticky top-0 bg-slate-400'>
                    {Object.keys(invoice[0]).map((key, idx) => (
                      <th key={idx} className='border-2 border-black' style={{ height: '30px', minWidth: '150px' }}>
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoice.map((row, idx) => (
                    <tr key={idx} className='text-center'>
                      {Object.values(row).map((value, i) => (
                        <td key={i} className='border-2 border-black' style={{ height: '30px', minWidth: '150px' }}>
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Upload;
