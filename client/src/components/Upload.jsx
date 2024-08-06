import React, { useState } from 'react';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';

const Upload = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [file, setFile] = useState(null);
  const [uploadedInvoices, setUploadedInvoices] = useState([]);
  const [invoicesQuotes, setInvoicesQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingInvoiceNumber, setCreatingInvoiceNumber] = useState(false);
  const [success, setSuccess] = useState('');


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleParseAndSubmit = async () => {
    setLoading(true)
    if (!file) {
      alert('No file selected');
      setLoading(false)
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
      console.log(parsedData)

      const uploadedUniqueKeys = [];

      for (let i = 0; i < parsedData.length; i++) {
        setCreatingInvoiceNumber(i)
        const items = parsedData[i].map(row => ({
          productName: row['Product Name'] || '',
          productCode: row['Product Code'] || '',
          size: row['Size'] || '',
          color: row['Color'] || '',
          lineQty: parseInt(row['Line Qty']) || 1,
          decorationProcess: row['Decoration Process'] || '',
          // unitPrice: parseFloat(row['Unit Price']) || 0, //old
          unitPrice: parseFloat(row['Unit Price'].replace('$', '')) || 0, //new
          lineTotal: parseFloat(row['Line Total']) || 0, // old
          // lineTotal: parseFloat(row['Line Total'].replace('$', '')) || 0, //new

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
          designPrice: parseFloat(row['Design Price']) || 0 //old
          // designPrice: parseFloat(row['Design Price'].replace('$', '')) || 0 //new
        }));

        const invoiceData = {
            type: parsedData[i][0]['Quote / Invoice'] || 'invoice',
          orderNumber: parsedData[i][0]['Order Number'] || '',
          dateOrdered: parsedData[i][0]['Date Ordered'] || '',
          dateDue: parsedData[i][0]['Date Due'] || '',
          // orderTotal: parseFloat(parsedData[i][0]['Order Total']) || 0, //old
          orderTotal: parseFloat(parsedData[i][0]['Order Total'].replace('$', '').replace(',', '')) || 0,//new

          billingCity: parsedData[i][0]['Billing City'] || '',
          billingAddress: parsedData[i][0]['Billing Address'] || '',
          billingState: parsedData[i][0]['Billing State'] || '',
          shippingAddress: parsedData[i][0]['Shipping Address'] || '',
          shippingCity: parsedData[i][0]['Shipping City'] || '',
          shippingMethod: parsedData[i][0]['Shipping Method'] || '',
          shippingState: parsedData[i][0]['Shipping State'] || '',
          shippingPostcode: parsedData[i][0]['Shipping Postcode/zip'] || '',

          shippingFirstName: parsedData[i][0]['Shipping First Name'] || '',
          shippingLastName: parsedData[i][0]['Shipping Last Name'] || '',
          billingFirstName: parsedData[i][0]['Billing First Name'] || '',
          billingLastName: parsedData[i][0]['Billing Last Name'] || '',
          paymentDue: 0,

          billingEmailAddress: parsedData[i][0]['Billing Email Address'] || '',



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
      setLoading(false)
    } catch (error) {
      console.error('Error during processing:', error);
      alert('Failed to process the file and submit invoices, It could be because of duplicate invoices');
      setLoading(false)


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


  const handleSave = () => {
    // Simulate saving data (you can replace this with actual API call or other logic)
    setTimeout(() => {
      setSuccess('Saved successfully!');
    }, 1000); // Assuming saving takes 1 second

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess('');
      window.location.reload();

    }, 3000); // Show success message for 3 seconds
  };

  // Function to format date into readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const cancel = async () => {
    const isConfirmed = window.confirm(`Are you sure you want to cancel uploading?`);
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
      setInvoicesQuotes([]);
    } catch (error) {
      console.error('Error deleting all uploaded invoices:', error);
      alert('Failed ');
    }
  };


  return (
    <div className="ml-56 mt-28">

      <div className="m-10 mb-[70vh]">
        <div className='flex items-center justify-center max-w-3xl mx-auto mt-8 p-4 bg-white shadow-xl  rounded-md border-2 py-8 border-[#f1f1f1] border-t-[#c2d6e7] border-b-[#c2d6e7]'>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className=""
          />
          <button
            onClick={handleParseAndSubmit}
            className=" py-2 bg-gradient-to-r from-blue-300 to-blue-200 border-2 border-blue-300 active:text-black  text-black font-bold rounded-md hover:scale-105 px-8 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
            OK
          </button>
        </div>

        <div className="mt-20 shadow-2xl p-5  border-2 border-[#f1f1f1] border-r-[#c5d9eb] border-l-[#c5d9eb] rounded-md">
          <div className='flex items-center justify-between mb-5 '>
            <h1 className="text-3xl font-bold font-Josefin-Sans text-[#3952ac]">Invoices/Quotes</h1>
            <div >
              <button onClick={cancel}
                className=" text-red-600 border-red-500 border-[1px] hover:red hover:bg-red-100 hover:text-red-500 m-1 font-bold px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button onClick={handleSave}
                className="no-print my-3 bg-transparent border-[1px] border-blue-500  hover:bg-blue-100 hover:text-black  text-blue-700 font-bold px-[20px] py-[5px] rounded"
              >
                Save All
              </button>
            </div>
          </div>
          {success && (
            <div className="my-4 bg-green-200 text-green-800 py-2 px-4 rounded">
              {success}
            </div>
          )}

          {loading && (
            <div className="my-4 bg-green-200 text-green-800 py-2 px-4 rounded">
            {  ` Processing invoice number ${creatingInvoiceNumber} ... `}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full  border border-blue-200 ">
              <thead className='rounded-lg'>
                <tr className='bg-blue-50 rounded-md py-20'>
                  {/* <th className="py-2 px-4 border-b">Unique Key</th> */}
                  <th className="py-2 px-4 border-b">Order Number</th>
                  <th className="py-2 px-4 border-b">Date Ordered</th>
                  <th className="py-2 px-4 border-b">Date Due</th>
                  <th className="py-2 px-4 border-b">Billing</th>
                  <th className="py-2 px-4 border-b">Shipping</th>
                  <th className="py-2 px-4 border-b">Order Total</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoicesQuotes.map((invoice, index) => (
                  <tr key={invoice.uniqueKey} className={`bg-white text-center ${index % 2 === 0 ? '' : 'bg-[#f1f1f1]'}`}>
                    {/* <td className="py-2 px-4 border-b">{invoice.uniqueKey}</td> */}
                    <td className="py-2 px-4 border-b">{invoice.orderNumber}</td>
                    <td className="py-2 px-4 border-b">{formatDate(invoice.dateOrdered)}</td>
                    <td className="py-2 px-4 border-b">{formatDate(invoice.dateDue)}</td>
                    <td className="py-2 px-4 border-b">{invoice.billingAddress}, {invoice.billingCity}</td>
                    <td className="py-2 px-4 border-b">{invoice.shippingAddress}, {invoice.shippingCity}</td>
                    <td className="py-2 px-4 border-b">${invoice.orderTotal.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">
                      <div className='flex items-center justify-center flex-wrap'>
                        <button
                          onClick={() => handleDelete(invoice.uniqueKey)}
                          className=" text-red-600 border-red-500 border-[1px] hover:red hover:bg-red-100 hover:text-red-500 m-1 font-bold px-4 py-1 rounded"
                        >
                          Delete
                        </button>


                        <Link to={`/Edit/${invoice.uniqueKey}`} target="_blank"
                          className="no-print my-3 bg-transparent border-[1px] border-blue-500  hover:bg-blue-100 hover:text-black  text-blue-700 font-bold px-[20px] py-[5px] rounded"
                        > Edit
                        </Link>
                      </div>
                    </td>
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

export default Upload;
