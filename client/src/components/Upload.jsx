import React, { useState } from 'react';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import UploadOrdersInstructions from './UploadOrdersInstructions';

const Upload = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  const [file, setFile] = useState(null);
  const [uploadedInvoices, setUploadedInvoices] = useState([]);
  const [invoicesQuotes, setInvoicesQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingInvoiceNumber, setCreatingInvoiceNumber] = useState(false);
  const [success, setSuccess] = useState('');
  const [toggleUploadOrdersInstructions, setToggleUploadOrdersInstructions] = useState(false);

  function handleToggle() {
    if (toggleUploadOrdersInstructions) {
      setToggleUploadOrdersInstructions(false);
    } else {
      setToggleUploadOrdersInstructions(true);
    }
  }


  const parseSizeString = (sizeString) => {
    // Ensure sizeString is a string and not empty
    if (!sizeString || typeof sizeString !== 'string') {
      console.error('Invalid input: sizeString should be a non-empty string');
      return {}; // Return an empty object if the input is invalid
    }

    // Initialize the size data object
    const sizeData = {
      sQty: 0, sPrice: 0, sTotal: 0,
      mQty: 0, mPrice: 0, mTotal: 0,
      lQty: 0, lPrice: 0, lTotal: 0,
      xlQty: 0, xlPrice: 0, xlTotal: 0,
      '2xlQty': 0, '2xlPrice': 0, '2xlTotal': 0,
      '3xlQty': 0, '3xlPrice': 0, '3xlTotal': 0,
      '4xlQty': 0, '4xlPrice': 0, '4xlTotal': 0,
      '5xlQty': 0, '5xlPrice': 0, '5xlTotal': 0
    };

    // Split the string into individual size entries
    const sizeEntries = sizeString.split(',').map(entry => entry.trim());

    sizeEntries.forEach(entry => {
      // Split by 'x' and trim parts
      const [size, quantityPart] = entry.split('x').map(part => part.trim());
      // Ensure quantity is a valid number
      const quantity = parseInt(quantityPart, 10) || 0;

      // Map size to the corresponding sizeData field
      switch (size) {
        case 'Small':
          sizeData.sQty = quantity;
          break;
        case 'Medium':
          sizeData.mQty = quantity;
          break;
        case 'Large':
          sizeData.lQty = quantity;
          break;
        case 'X Large':
          sizeData.xlQty = quantity;
          break;
        case '2X Large':
          sizeData['2xlQty'] = quantity;
          break;
        case '3X Large':
          sizeData['3xlQty'] = quantity;
          break;
        case '4X Large':
          sizeData['4xlQty'] = quantity;
          break;
        case '5X Large':
          sizeData['5xlQty'] = quantity;
          break;
        default:
          console.warn(`Unknown size: ${size}`);
          break;
      }
    });

    return sizeData;
  };









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
            console.log(`parsed data ${JSON.stringify(result.data, null, 2)}`); // Log the parsed data to check format

            // Sanitize header keys
            const sanitizedData = result.data.map((row) => {
              const sanitizedRow = {};
              Object.keys(row).forEach((key) => {
                // Trim spaces and remove quotes from keys
                const sanitizedKey = key.trim().replace(/"/g, '');
                sanitizedRow[sanitizedKey] = row[key];
              });
              return sanitizedRow;
            });

            const filteredData = sanitizedData.filter((row) => Object.values(row).some((value) => value !== ''));

            const groupedData = {};
            filteredData.forEach((row) => {
              const orderNumber = row['Order Number'] || row['Invoice/Quote Number'];
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
      console.log(parsedData);

      const sizeString = parsedData.size
      const parsedSizeData = parseSizeString(sizeString);
      console.log(`this ${parsedSizeData}`);


      const uploadedUniqueKeys = [];

      for (let i = 0; i < parsedData.length; i++) {
        setCreatingInvoiceNumber(i);



        const items = parsedData[i].map(function (row) {

          const sizeString = row['Size'] || '';
          const parsedSizeData = parseSizeString(sizeString);
          // console.log(`sizeString ${sizeString}`)
          // console.log(`parsedSizeData ${JSON.stringify(parsedSizeData)}`)
          // console.log(`parsedSizeData ${parsedSizeData.sQty}`)

          function getPriceBasedOnQty(qty, unitPrice) {
            return qty > 0 ? parseFloat(unitPrice ? unitPrice.replace(/[$,]/g, '') : '0') || 0 : 0;
          }


          return {

            sQty: parsedSizeData.sQty || '',
            sPrice: getPriceBasedOnQty(parsedSizeData.sQty, row['Unit Price']),
            sTotal: parsedSizeData.sTotal || '',
            mQty: parsedSizeData.mQty || '',
            mPrice: getPriceBasedOnQty(parsedSizeData.mQty, row['Unit Price']),
            mTotal: parsedSizeData.mTotal || '',
            lQty: parsedSizeData.lQty || '',
            lPrice: getPriceBasedOnQty(parsedSizeData.lQty, row['Unit Price']),
            lTotal: parsedSizeData.lTotal || '',
            xlQty: parsedSizeData.xlQty || '',
            xlPrice: getPriceBasedOnQty(parsedSizeData.xlQty, row['Unit Price']),
            xlTotal: parsedSizeData.xlTotal || '',
            '2xlQty': parsedSizeData['2xlQty'] || '',
            '2xlPrice': getPriceBasedOnQty(parsedSizeData['2xlQty'], row['Unit Price']),
            '2xlTotal': parsedSizeData['2xlTotal'] || '',
            '3xlQty': parsedSizeData['3xlQty'] || '',
            '3xlPrice': getPriceBasedOnQty(parsedSizeData['3xlQty'], row['Unit Price']),
            '3xlTotal': parsedSizeData['3xlTotal'] || '',
            '4xlQty': parsedSizeData['4xlQty'] || '',
            '4xlPrice': getPriceBasedOnQty(parsedSizeData['4xlQty'], row['Unit Price']),
            '4xlTotal': parsedSizeData['4xlTotal'] || '',
            '5xlQty': parsedSizeData['5xlQty'] || '',
            '5xlPrice': getPriceBasedOnQty(parsedSizeData['5xlQty'], row['Unit Price']),
            '5xlTotal': parsedSizeData['5xlTotal'] || '',



            productName: row['Product Name'] || '',
            productCode: row['Product Code'] || '',
            size: row['Size'] || '',
            color: row['Color'] || '',
            lineQty: parseInt(row['Line Qty']) || 1,
            decorationProcess: row['Decoration Process'] || '',
            unitPrice: parseFloat(row['Unit Price'] ? row['Unit Price'].replace(/[$,]/g, '') : '0') || 0,
            lineTotal: parseFloat(row['Line Total'] ? row['Line Total'].replace(/[$,]/g, '') : '0') || 0,
            tax: parseFloat(row['Tax'] ? row['Tax'].replace(/[$,]/g, '') : '0') || 0,
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
          };
        }
        );

        const invoiceData = {
          type: parsedData[i][0]['Quote / Invoice'] || parsedData[i][0]['Status'],
          orderNumber: parsedData[i][0]['Order Number'] || parsedData[i][0]['Invoice/Quote Number'],
          dateOrdered: parsedData[i][0]['Date Ordered'] || '',
          dateDue: parsedData[i][0]['Date Due'] || '',
          // orderTotal: parseFloat(parsedData[i][0]['Order Total']) || 0, //old
          // orderTotal: parseFloat(parsedData[i][0]['Order Total'].replace('$', '').replace(',', '')) || 0,//new
          orderTotal: parseFloat(parsedData[i][0]['Order Total'] ? parsedData[i][0]['Order Total'].replace('$', '').replace(',', '') : '0') || 0,
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
          orderTotal: parseFloat(parsedData[i][0]['Order Total'] ? parsedData[i][0]['Order Total'].replace('$', '').replace(',', '') : '') || 0,
          billingEmailAddress: parsedData[i][0]['Billing Email Address'] || '',

          items: items,
          note: '',


        };

        const customerData = {
          primaryContactFirstName: parsedData[i][0]['Billing First Name'] || '',
          primaryContactLastName: parsedData[i][0]['Billing Last Name'] || '',
          primaryContactEmail: parsedData[i][0]['Billing Email Address'] || '',
          primaryContactPhone: parsedData[i][0]['Billing Phone No.'] || '',
          // accountNumber,
          // website,
          // notes,
          // billingCurrency,
          billingAddress1: parsedData[i][0]['Billing Email Address'] || '',
          billingAddress2: parsedData[i][0]['Billing Email Address'] || '',
          // billingCountry,
          billingState: parsedData[i][0]['Billing State'] || '',
          billingCity: parsedData[i][0]['Billing City'] || '',
          billingPostal: parsedData[i][0]['Billing Postcode/zip'] || '',
          shippingName: parsedData[i][0]['Shipping First Name'] || '',
          shippingAddress1: parsedData[i][0]['Shipping Address'] || '',
          shippingAddress2: parsedData[i][0]['Shipping Address'] || '',
          // shippingCountry,
          shippingState: parsedData[i][0]['Shipping State'] || '',
          shippingCity: parsedData[i][0]['Shipping City'] || '',
          shippingPostal: parsedData[i][0]['Shipping Postcode/zip'] || '',
          shippingPhone: parsedData[i][0]['Shipping Phone No.'] || ''
          // shippingDeliveryInstructions,
        };

        console.log('Invoice Data:', invoiceData);

        const response = await fetch(`${BASE_URL}/api/invoicequote/uploadCreateInvoiceQuote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include token in header

          },
          body: JSON.stringify(invoiceData)
        });

        if (!response.ok) {
          throw new Error(`Failed to upload invoice ${i + 1}`);
        }

        const result = await response.json();
        uploadedUniqueKeys.push(result.invoiceOrQuote.uniqueKey);
        console.log(`Invoice ${i + 1} submitted successfully`);

        const customerResponse = await fetch(`${BASE_URL}/api/customer/uploadCustomer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include token in header

          },
          body: JSON.stringify(customerData)
        });
      }

      fetchUploadedInvoices(uploadedUniqueKeys);
      setLoading(false);
    } catch (error) {
      console.error('Error during processing:', error);
      alert('Failed to process the file and submit invoices, It could be because of duplicate invoices');
      setLoading(false);
    }
  };

  const fetchUploadedInvoices = async (uniqueKeys) => {
    try {
      const response = await fetch(`${BASE_URL}/api/invoicequote/getInvoicesByUniqueKeys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include token in header

        },
        body: JSON.stringify({ uniqueKeys })
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
          'Authorization': `Bearer ${token}` // Include token in header

        },
        body: JSON.stringify({ uniqueKey })
      });
      if (!response.ok) {
        throw new Error('Failed to delete data');
      }
      setInvoicesQuotes(invoicesQuotes.filter((item) => item.uniqueKey !== uniqueKey)); // Update state after deletion
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
      const uniqueKeys = invoicesQuotes.map((invoice) => invoice.uniqueKey);
      const response = await fetch(`${BASE_URL}/api/invoicequote/deleteMultipleInvoices`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include token in header

        },
        body: JSON.stringify({ uniqueKeys })
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
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="rounded-2xl border-2 border-[#6D8196] bg-[#F8FAFC] p-6 lg:p-8 shadow-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-4">
          <input type="file" accept=".csv" onChange={handleFileChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
          <button onClick={handleParseAndSubmit}
            className="rounded-lg bg-gradient-to-r from-[#6A89A7] to-[#88BDF2] px-6 py-2.5 font-semibold text-white hover:from-[#88BDF2] hover:to-[#6A89A7] transition-colors duration-200"
          >
            Upload
          </button>
        </div>
      </div>

        <div className="rounded-2xl border-2 border-[#6D8196] bg-[#F8FAFC] p-6 lg:p-8 shadow-lg">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-[#384959]">Invoices/Quotes</h1>
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <button onClick={handleToggle} className="rounded-lg px-4 py-2 font-semibold text-[#6A89A7] hover:text-[#384959] transition-colors duration-200">
                  File Format?
                </button>
                {toggleUploadOrdersInstructions &&
                  <div className="mt-4">
                    <UploadOrdersInstructions>
                      <button onClick={handleToggle} className="rounded-lg border-2 border-[#6A89A7] px-4 py-2 font-semibold text-[#6A89A7] hover:bg-[#6A89A7] hover:text-white transition-colors duration-200">
                        X
                      </button>
                    </UploadOrdersInstructions>
                  </div>}
              </div>
              <button onClick={cancel} className="rounded-lg border-2 border-red-400 px-4 py-2 font-semibold text-red-400 hover:bg-red-400 hover:text-white transition-colors duration-200">
                Cancel
              </button>
              <button onClick={handleSave} className="rounded-lg border-2 border-[#6A89A7] px-6 py-2.5 font-semibold text-[#6A89A7] hover:bg-[#6A89A7] hover:text-white transition-colors duration-200">
                Save All
              </button>
            </div>
          </div>
          {success && <div className="mb-4 rounded-xl bg-[#BDDDFC] px-6 py-4 text-center text-[#88BDF2]">{success}</div>}
          {loading && <div className="mb-4 rounded-xl bg-[#BDDDFC] px-6 py-4 text-center text-[#384959]">Processing invoice number {creatingInvoiceNumber}...</div>}

          <div className="overflow-x-auto rounded-xl border-2 border-[#6D8196]">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-[#BDDDFC]">
                  <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Order Number</th>
                  <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Date Ordered</th>
                  <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Date Due</th>
                  <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Billing</th>
                  <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Shipping</th>
                  <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Order Total</th>
                  <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoicesQuotes.map((invoice, index) => (
                  <tr key={invoice.uniqueKey} className={`border-t border-[#6D8196] hover:bg-[#BDDDFC] transition-colors duration-200 ${index % 2 === 0 ? '' : 'bg-[#BDDDFC]'}`}>
                    <td className="px-4 py-3 text-sm text-[#384959]">{invoice.orderNumber}</td>
                    <td className="px-4 py-3 text-sm text-[#384959]">{formatDate(invoice.dateOrdered)}</td>
                    <td className="px-4 py-3 text-sm text-[#384959]">{formatDate(invoice.dateDue)}</td>
                    <td className="px-4 py-3 text-sm text-[#384959]">
                      {invoice.billingAddress}, {invoice.billingCity}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#384959]">
                      {invoice.shippingAddress}, {invoice.shippingCity}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#384959]">${invoice.orderTotal.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => handleDelete(invoice.uniqueKey)} className="rounded-lg border-2 border-red-400 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-400 hover:text-white transition-colors duration-200">
                          Delete
                        </button>
                        <Link to={`/Edit/${invoice.uniqueKey}`} target="_blank" className="rounded-lg border-2 border-[#6A89A7] px-4 py-2 text-sm font-semibold text-[#6A89A7] hover:bg-[#6A89A7] hover:text-white transition-colors duration-200">
                          Edit
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
  );
};

export default Upload;
