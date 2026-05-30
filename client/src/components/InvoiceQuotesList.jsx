import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem('token');


const InvoiceQuotesList = () => {
  const [invoicesQuotes, setInvoicesQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [printBtn, setPrintBtn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = invoicesQuotes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(invoicesQuotes.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="rounded-2xl border-2 border-[#6D8196] bg-[#F8FAFC] p-6 lg:p-8 shadow-lg">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-[#384959]">All Invoices/Quotes</h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="sortOption" className="text-sm font-medium text-[#384959]">
                Sort by:
              </label>
              <select id="sortOption" name="sortOption" value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="rounded-lg border-2 border-[#6D8196] px-4 py-2 text-[#384959] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none">
                <option value="latestDateOrdered">Latest Date Ordered</option>
                <option value="oldestDateOrdered">Oldest Date Ordered</option>
                <option value="latestDateDue">Latest Date Due</option>
                <option value="oldestDateDue">Oldest Date Due</option>
                <option value="highestOrderTotal">Highest Order Total</option>
                <option value="lowestOrderTotal">Lowest Order Total</option>
              </select>
            </div>
            {printBtn && (
              <Link to={`/print/${selectedInvoices}`} target="_blank" className="rounded-lg border-2 border-[#6A89A7] px-6 py-2.5 font-semibold text-[#6A89A7] hover:bg-[#6A89A7] hover:text-white transition-colors duration-200">
                Print
              </Link>
            )}
            {!printBtn && <p className="text-sm font-medium text-red-400">Please Select to Print</p>}
            <NavLink exact to="/uploadPage" className="rounded-lg bg-gradient-to-r from-[#6A89A7] to-[#88BDF2] px-6 py-2.5 font-semibold text-white hover:from-[#88BDF2] hover:to-[#6A89A7] transition-colors duration-200">
              Upload
            </NavLink>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <input type="text" name="billingFirstName" placeholder="Filter by Billing First Name" value={filters.billingFirstName} onChange={handleFilterChange} className="flex-1 min-w-[200px] rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
            <input type="text" name="billingLastName" placeholder="Filter by Billing Last Name" value={filters.billingLastName} onChange={handleFilterChange} className="flex-1 min-w-[200px] rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
            <input type="text" name="orderNumber" placeholder="Filter by Order Number" value={filters.orderNumber} onChange={handleFilterChange} className="flex-1 min-w-[200px] rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-[#384959]">Filter by Order date:</label>
            <label className="text-sm font-medium text-[#384959]">From</label>
            <input type="date" name="dateOrderedStart" value={filters.dateOrderedStart} onChange={handleFilterChange} className="rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
            <label className="text-sm font-medium text-[#384959]">To</label>
            <input type="date" name="dateOrderedEnd" value={filters.dateOrderedEnd} onChange={handleFilterChange} className="rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-[#384959]">Filter by Due Date:</label>
            <label className="text-sm font-medium text-[#384959]">From</label>
            <input type="date" name="dateDueStart" value={filters.dateDueStart} onChange={handleFilterChange} className="rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
            <label className="text-sm font-medium text-[#384959]">To</label>
            <input type="date" name="dateDueEnd" value={filters.dateDueEnd} onChange={handleFilterChange} className="rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
          </div>
        </div>

        {loading && <div className="rounded-xl bg-[#BDDDFC] px-6 py-4 text-center text-[#384959]">Loading...</div>}

        {!loading && invoicesQuotes.length === 0 && <div className="rounded-xl bg-[#BDDDFC] px-6 py-4 text-center text-[#384959]">No data available</div>}

        <div className="overflow-x-auto rounded-xl border-2 border-[#6D8196]">
          <table className="w-full table-auto bg-white">
            <thead>
              <tr className="bg-[#BDDDFC]">
                <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">
                  <input type="checkbox" checked={selectedInvoices.length === invoicesQuotes.length} onChange={handleSelectAll} className="rounded border-2 border-[#6D8196] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                </th>
                <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Order Number</th>
                <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Type</th>
                <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Name</th>
                <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Date Ordered</th>
                <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Date Due</th>
                <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Payment Due</th>
                <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Order Total</th>
                <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((invoice) => (
                <tr key={invoice.uniqueKey} className="border-t border-[#6D8196] hover:bg-[#BDDDFC] transition-colors duration-200">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedInvoices.includes(invoice.uniqueKey)} onChange={() => handleSelectInvoice(invoice.uniqueKey)} className="rounded border-2 border-[#6D8196] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </td>
                  <td className="px-4 py-3 text-sm text-[#384959]">{invoice.orderNumber}</td>
                  <td className="px-4 py-3 text-sm text-[#384959]">{invoice.type || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-[#384959]">{invoice.billingFirstName}</td>
                  <td className="px-4 py-3 text-sm text-[#384959]">{formatDate(invoice.dateOrdered)}</td>
                  <td className="px-4 py-3 text-sm text-[#384959]">{formatDate(invoice.dateDue)}</td>
                  <td className="px-4 py-3 text-sm text-[#384959]">{invoice.paymentDue}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#384959]">${invoice.orderTotal.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <Link to={`/edit/${invoice.uniqueKey}`} className="flex items-center gap-2 rounded-lg border-2 border-[#6A89A7] px-3 py-1.5 text-sm font-semibold text-[#6A89A7] hover:bg-[#6A89A7] hover:text-white transition-colors duration-200">
                        <FaEdit className="text-sm" />
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(invoice.uniqueKey)} className="flex items-center gap-2 rounded-lg border-2 border-red-400 px-3 py-1.5 text-sm font-semibold text-red-400 hover:bg-red-400 hover:text-white transition-colors duration-200">
                        <FaTrash className="text-sm" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {invoicesQuotes.length > itemsPerPage && (
          <div className="mt-6 flex items-center justify-between rounded-xl border-2 border-[#6D8196] bg-[#BDDDFC] p-4">
            <div className="text-sm text-[#384959]">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, invoicesQuotes.length)} of {invoicesQuotes.length} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2 rounded-lg border-2 border-[#6D8196] px-4 py-2 text-sm font-semibold text-[#384959] transition-all duration-200 hover:bg-[#6A89A7] hover:border-[#6A89A7] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-[#6D8196] disabled:hover:text-[#384959]"
              >
                <FaChevronLeft className="text-xs" />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`min-w-[40px] rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                      currentPage === pageNumber
                        ? 'bg-[#6A89A7] text-white shadow-md'
                        : 'border-2 border-[#6D8196] text-[#384959] hover:bg-[#6A89A7] hover:border-[#6A89A7] hover:text-white'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 rounded-lg border-2 border-[#6D8196] px-4 py-2 text-sm font-semibold text-[#384959] transition-all duration-200 hover:bg-[#6A89A7] hover:border-[#6A89A7] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-[#6D8196] disabled:hover:text-[#384959]"
              >
                Next
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceQuotesList;
