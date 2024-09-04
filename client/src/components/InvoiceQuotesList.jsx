import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem('token');


const InvoiceQuotesList = () => {
  const [invoicesQuotes, setInvoicesQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [printBtn, setPrintBtn] = useState(false);
  const [filters, setFilters] = useState({
    billingFirstName: '',
    billingLastName: '',
    orderNumber: '',
    dateOrderedStart: '',
    dateOrderedEnd: '',
    dateDueStart: '',
    dateDueEnd: ''
  });
  const [sortOption, setSortOption] = useState('latestDateOrdered');

  useEffect(() => {
    if (selectedInvoices.length > 0) {
      setPrintBtn(true);
    } else {
      setPrintBtn(false);
    }
  }, [selectedInvoices]);

  useEffect(() => {
    fetchInvoicesQuotes();
  }, [filters]);

  useEffect(() => {
    handleSort();
  }, [sortOption]);

  const fetchInvoicesQuotes = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${BASE_URL}/api/invoicequote/allInvoicesQuotes?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}` // Include token in header
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data);
      setLoading(false);
      setInvoicesQuotes(data.data);
    } catch (error) {
      console.error('Error fetching invoices and quotes:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleDelete = async (uniqueKey) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete this item?`);
    if (!isConfirmed) {
      return;
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
      setInvoicesQuotes(invoicesQuotes.filter((item) => item.uniqueKey !== uniqueKey));
    } catch (error) {
      console.error('Error deleting invoice/quote:', error);
    }
  };

  const handleSelectInvoice = (uniqueKey) => {
    if (selectedInvoices.includes(uniqueKey)) {
      setSelectedInvoices(selectedInvoices.filter((key) => key !== uniqueKey));
    } else {
      setSelectedInvoices([...selectedInvoices, uniqueKey]);
    }
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === invoicesQuotes.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(invoicesQuotes.map((invoice) => invoice.uniqueKey));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSort = () => {
    const sortedInvoices = [...invoicesQuotes];
    switch (sortOption) {
      case 'latestDateOrdered':
        sortedInvoices.sort((a, b) => new Date(b.dateOrdered) - new Date(a.dateOrdered));
        break;
      case 'oldestDateOrdered':
        sortedInvoices.sort((a, b) => new Date(a.dateOrdered) - new Date(b.dateOrdered));
        break;
      case 'latestDateDue':
        sortedInvoices.sort((a, b) => new Date(b.dateDue) - new Date(a.dateDue));
        break;
      case 'oldestDateDue':
        sortedInvoices.sort((a, b) => new Date(a.dateDue) - new Date(b.dateDue));
        break;
      case 'highestOrderTotal':
        sortedInvoices.sort((a, b) => b.orderTotal - a.orderTotal);
        break;
      case 'lowestOrderTotal':
        sortedInvoices.sort((a, b) => a.orderTotal - b.orderTotal);
        break;
      default:
        break;
    }
    setInvoicesQuotes(sortedInvoices);
  };

  return (
    <div className="ml-60 mr-5 mt-32">
      <div className="container mx-auto my-5 rounded-lg border-2 border-solid border-[#f1f1f1] border-b-slate-300 border-l-[#d1e4f5] border-r-[#d1e4f5] bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="mb-4 text-3xl font-bold">All Invoices/Quotes</h1>
          <div className="flex items-center justify-between">
            <div className="mr-4">
              <label htmlFor="sortOption" className="mr-2">
                Sort by:
              </label>
              <select id="sortOption" name="sortOption" value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="rounded border border-gray-300 px-4 py-2">
                <option value="latestDateOrdered">Latest Date Ordered</option>
                <option value="oldestDateOrdered">Oldest Date Ordered</option>
                <option value="latestDateDue">Latest Date Due</option>
                <option value="oldestDateDue">Oldest Date Due</option>
                <option value="highestOrderTotal">Highest Order Total</option>
                <option value="lowestOrderTotal">Lowest Order Total</option>
              </select>
            </div>
            {printBtn && (
              <Link to={`/print/${selectedInvoices}`} target="_blank" className="my-3 mr-2 rounded border-[2px] border-blue-500 bg-transparent px-[20px] py-[5px] font-bold text-blue-700 hover:bg-blue-100 hover:text-black">
                Print
              </Link>
            )}
            {!printBtn && <p className="hover:red m-1 my-4 rounded px-4 py-1 font-semibold text-red-600">Please Select to Print</p>}
            <NavLink exact to="/uploadPage" className="rounded-md border-2 border-blue-300 bg-gradient-to-r from-blue-200 to-blue-300 px-8 py-2 font-semibold text-black hover:scale-105 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none active:text-black">
              Upload
            </NavLink>
          </div>
        </div>

        <div className="mb-4">
          <input type="text" name="billingFirstName" placeholder="Filter by Billing First Name" value={filters.billingFirstName} onChange={handleFilterChange} className="mr-2 rounded border border-gray-300 px-4 py-2 placeholder-gray-500" />
          <input type="text" name="billingLastName" placeholder="Filter by Billing Last Name" value={filters.billingLastName} onChange={handleFilterChange} className="mr-2 rounded border border-gray-300 px-4 py-2 placeholder-gray-500" />
          <input type="text" name="orderNumber" placeholder="Filter by Order Number" value={filters.orderNumber} onChange={handleFilterChange} className="mr-2 rounded border border-gray-300 px-4 py-2 placeholder-gray-500" />
          <div>
            <label> Filter by Order date: </label>
            <label> From </label>
            <input type="date" name="dateOrderedStart" value={filters.dateOrderedStart} onChange={handleFilterChange} className="mr-2 rounded border border-gray-300 px-4 py-2" />
            <label>To </label>
            <input type="date" name="dateOrderedEnd" value={filters.dateOrderedEnd} onChange={handleFilterChange} className="mr-2 mt-2 rounded border border-gray-300 px-4 py-2" />
          </div>
          <div>
            <label> Filter by Due Date: </label>
            <label> From </label>
            <input type="date" name="dateDueStart" value={filters.dateDueStart} onChange={handleFilterChange} className="mr-2 mt-2 rounded border border-gray-300 px-4 py-2" />
            <label>To </label>
            <input type="date" name="dateDueEnd" value={filters.dateDueEnd} onChange={handleFilterChange} className="rounded border border-gray-300 px-4 py-2" />
          </div>
        </div>

        {loading && <div className="my-4 rounded bg-blue-200 px-4 py-2 text-green-800">Loading...</div>}

        {!loading && invoicesQuotes.length === 0 && <div className="my-4 mt-10 rounded bg-blue-200 px-4 py-2 text-yellow-800">No data available</div>}

        <table className="mt-10 w-full table-auto border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 bg-blue-100 px-4 py-2">
                <input type="checkbox" checked={selectedInvoices.length === invoicesQuotes.length} onChange={handleSelectAll} className="mr-2" />
                {/* Select All */}
              </th>
              <th className="border border-gray-300 bg-blue-100 px-4 py-3">Order Number</th>
              <th className="border border-gray-300 bg-blue-100 px-4 py-3">Type</th>

              {/* <th>Billing First Name</th> */}
              <th className="border border-gray-300 bg-blue-100 px-4 py-3"> Name</th>
              {/* <th>Billing Last Name</th> */}
              <th className="border border-gray-300 bg-blue-100 px-4 py-3">Date Ordered</th>
              <th className="border border-gray-300 bg-blue-100 px-4 py-3">Date Due</th>
              <th className="border border-gray-300 bg-blue-100 px-4 py-3">Payment Due</th>
              <th className="border border-gray-300 bg-blue-100 px-4 py-3">Order Total</th>
              <th className="border border-gray-300 bg-blue-100 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoicesQuotes.map((invoice) => (
              <tr key={invoice.uniqueKey} className="border-t text-center">
                <td className="border border-gray-300 px-4 py-2">
                  <input type="checkbox" checked={selectedInvoices.includes(invoice.uniqueKey)} onChange={() => handleSelectInvoice(invoice.uniqueKey)} />
                </td>
                <td className="border border-gray-300 px-4 py-2">{invoice.orderNumber}</td>
                <td className="border border-gray-300 px-4 py-2">{invoice.type || 'N/A'}</td> {/* Add type column */}
                <td className="border border-gray-300 px-4 py-2">{invoice.billingFirstName} </td>
                {/* <td>{invoice.billingLastName}</td> */}
                <td className="border border-gray-300 px-4 py-2">{formatDate(invoice.dateOrdered)}</td>
                <td className="border border-gray-300 px-4 py-2">{formatDate(invoice.dateDue)}</td>
                <td className="border border-gray-300 px-4 py-2">{invoice.paymentDue}</td>
                <td className="border border-gray-300 px-4 py-2">${invoice.orderTotal.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link to={`/edit/${invoice.uniqueKey}`} className="mr-4 text-blue-500 hover:underline">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(invoice.uniqueKey)} className="ml-4 text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceQuotesList;
