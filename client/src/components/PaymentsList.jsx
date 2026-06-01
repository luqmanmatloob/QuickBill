import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { Link } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const token = localStorage.getItem('token');


const PaymentsList = () => {
  const [invoicesQuotes, setInvoicesQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [printBtn, setPrintBtn] = useState(false);
  const [filters, setFilters] = useState({
    billingFirstName: '',
    billingLastName: '',
    orderNumber: '',
    dateOrdered: ''
  });

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

  const fetchInvoicesQuotes = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${BASE_URL}/api/invoicequote/allInvoicesQuotes?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}` // Include token in header
          }
        },

      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setLoading(false);
      const reversedData = data.data.reverse();
      setInvoicesQuotes(reversedData);
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="rounded-2xl border-2 border-[#6D8196] bg-[#F8FAFC] p-6 lg:p-8 shadow-lg">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-[#384959]">All Payments</h1>
          <NavLink exact to="/uploadpaymentspage" className="rounded-lg bg-gradient-to-r from-[#6A89A7] to-[#88BDF2] px-6 py-2.5 font-semibold text-white hover:from-[#88BDF2] hover:to-[#6A89A7] transition-colors duration-200">
            Upload
          </NavLink>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-[#384959]">Search:</label>
          <input
            type="text"
            name="orderNumber"
            placeholder="Search By Invoice/Quote Number"
            value={filters.orderNumber}
            onChange={handleFilterChange}
            className="mt-2 w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none"
          />
        </div>

        {loading && <div className="rounded-xl bg-[#BDDDFC] px-6 py-4 text-center text-[#384959]">Loading Invoices...</div>}

        <div className="overflow-x-auto rounded-xl border-2 border-[#6D8196]">
          <table className="w-full table-auto bg-white">
            <thead>
              <tr className="bg-[#BDDDFC]">
                <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Order Number</th>
                <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Payment Date</th>
                <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Payment Amount</th>
                <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Payment Method</th>
                <th className="border-b border-[#6D8196] px-4 py-3 text-left text-sm font-semibold text-[#384959]">Edit</th>
              </tr>
            </thead>
            <tbody>
              {invoicesQuotes.flatMap((invoiceQuote) =>
                invoiceQuote.payments.map((payment, index) => (
                  <tr key={`${invoiceQuote._id}-${index}`} className={`border-t border-[#6D8196] hover:bg-[#BDDDFC] transition-colors duration-200 ${index % 2 === 0 ? '' : 'bg-[#BDDDFC]'}`}>
                    <td className="px-4 py-3 text-sm text-[#384959]">{invoiceQuote.orderNumber}</td>
                    <td className="px-4 py-3 text-sm text-[#384959]">{formatDate(payment.datePaid)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#384959]">${payment.orderPaymentAmount}</td>
                    <td className="px-4 py-3 text-sm text-[#384959]">{payment.paymentMethod}</td>
                    <td className="px-4 py-3">
                      <Link to={`/Edit/${invoiceQuote.uniqueKey}`} className="text-sm font-semibold text-[#6A89A7] hover:underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsList;
