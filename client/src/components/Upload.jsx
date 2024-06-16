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
          setCsvData(filteredData);
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
        const rowData = csvData[i];

        // Prepare formData for the current invoice
        const invoiceData = {
          type: 'invoice', // Assuming it's always an invoice based on formData initial state
          orderNumber: rowData.orderNumber,
          dateOrdered: rowData['dateOrdered'] || '',
          dateDue: rowData['dateDue'] || '',
          orderTotal: parseFloat(rowData['orderTotal']) || 0,
          billingCity: rowData['billingCity'] || '',
          billingAddress: rowData['billingAddress'] || '',
          billingState: rowData['billingState'] || '',
          shippingAddress: rowData['shippingAddress'] || '',
          shippingCity: rowData['shippingCity'] || '',
          shippingMethod: rowData['shippingMethod'] || '',
          shippingState: rowData['shippingState'] || '',
          shippingPostcode: rowData['shippingPostcode'] || '',
          items: [{
            productName: rowData['productName'] || '',
            productCode: rowData['productCode'] || '',
            size: rowData['size'] || '',
            color: rowData['color'] || '',
            lineQty: parseInt(rowData['lineQty']) || 1,
            decorationProcess: rowData['decorationProcess'] || '',
            unitPrice: parseFloat(rowData['unitPrice']) || 0,
            lineTotal: parseFloat(rowData['lineTotal']) || 0,
            tax: parseFloat(rowData['tax']) || 0,
            taxExempt: rowData['taxExempt'] === 'true',
            orderShippingTotal: parseFloat(rowData['orderShippingTotal']) || 0,
            poNumber: rowData['poNumber'] || '',
            supplierPoNumber: rowData['supplierPoNumber'] || '',
            productionStaffAccount: rowData['productionStaffAccount'] || '',
            storeName: rowData['storeName'] || '',
            company: rowData['company'] || '',
            billingFirstName: rowData['billingFirstName'] || '',
            billingLastName: rowData['billingLastName'] || '',
            billingEmailAddress: rowData['billingEmailAddress'] || '',
            billingAddress: rowData['billingAddress'] || '',
            billingCity: rowData['billingCity'] || '',
            billingState: rowData['billingState'] || '',
            billingPostcode: rowData['billingPostcode'] || '',
            billingPhoneNo: rowData['billingPhoneNo'] || '',
            shippingFirstName: rowData['shippingFirstName'] || '',
            shippingLastName: rowData['shippingLastName'] || '',
            shippingAddress: rowData['shippingAddress'] || '',
            shippingCity: rowData['shippingCity'] || '',
            shippingState: rowData['shippingState'] || '',
            shippingPostcode: rowData['shippingPostcode'] || '',
            shippingPhoneNo: rowData['shippingPhoneNo'] || '',
            shippingMethod: rowData['shippingMethod'] || '',
            designName: rowData['designName'] || '',
            designPrice: parseFloat(rowData['designPrice']) || 0
          }],
          note: '' 
        };

        console.log(csvData[i]); 
        console.log(invoiceData); 

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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
        Submit Invoices
      </button>

      {/* Container for parsed CSV data table */}
      <div id="table-container" className="mt-4 overflow-x-auto overflow-y-auto" style={{ maxHeight: '80vh' }}>
        {csvData.length > 0 &&
          <table className='w-full table-auto'>
            <thead className='bg-gray-400 border-2 border-black'>
              <tr className='text-center sticky top-0 bg-slate-400'>
                {Object.keys(csvData[0]).map((key, index) => (
                  <th key={index} className='border-2 border-black' style={{ height: '30px', minWidth: '150px' }}>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, index) => (
                <tr key={index} className='text-center'>
                  {Object.values(row).map((value, idx) => (
                    <td key={idx} className='border-2 border-black' style={{ height: '30px', minWidth: '150px' }}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
};

export default Upload;
