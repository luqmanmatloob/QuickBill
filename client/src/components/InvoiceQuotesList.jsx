import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;

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
        dateDueEnd: '',
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
            const response = await fetch(`${BASE_URL}/api/invoicequote/allInvoicesQuotes?${queryParams}`);

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
                },
                body: JSON.stringify({ uniqueKey }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete data');
            }
            setInvoicesQuotes(invoicesQuotes.filter(item => item.uniqueKey !== uniqueKey));
        } catch (error) {
            console.error('Error deleting invoice/quote:', error);
        }
    };

    const handleSelectInvoice = (uniqueKey) => {
        if (selectedInvoices.includes(uniqueKey)) {
            setSelectedInvoices(selectedInvoices.filter(key => key !== uniqueKey));
        } else {
            setSelectedInvoices([...selectedInvoices, uniqueKey]);
        }
    };

    const handleSelectAll = () => {
        if (selectedInvoices.length === invoicesQuotes.length) {
            setSelectedInvoices([]);
        } else {
            setSelectedInvoices(invoicesQuotes.map(invoice => invoice.uniqueKey));
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
            <div className="container p-6 mx-auto bg-white rounded-lg shadow-xl my-5 border-b-slate-300 border-solid border-2 border-[#f1f1f1] border-r-[#d1e4f5] border-l-[#d1e4f5]">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-3xl font-bold mb-4">All Invoices/Quotes</h1>
                    <div className="flex justify-between items-center">
                        <div className="mr-4">
                            <label htmlFor="sortOption" className="mr-2">Sort by:</label>
                            <select
                                id="sortOption"
                                name="sortOption"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="border border-gray-300 px-4 py-2 rounded"
                            >
                                <option value="latestDateOrdered">Latest Date Ordered</option>
                                <option value="oldestDateOrdered">Oldest Date Ordered</option>
                                <option value="latestDateDue">Latest Date Due</option>
                                <option value="oldestDateDue">Oldest Date Due</option>
                                <option value="highestOrderTotal">Highest Order Total</option>
                                <option value="lowestOrderTotal">Lowest Order Total</option>
                            </select>
                        </div>
                        {printBtn && (
                            <Link to={`/print/${selectedInvoices}`} target="_blank"
                                className="my-3 mr-2 bg-transparent border-[2px] border-blue-500 hover:bg-blue-100 hover:text-black text-blue-700 font-bold px-[20px] py-[5px] rounded"
                            >
                                Print
                            </Link>
                        )}
                        {!printBtn && (
                            <p className="text-red-600 hover:red m-1 my-4 font-semibold px-4 py-1 rounded">
                                Please Select to Print
                            </p>
                        )}
                        <NavLink exact to="/uploadPage"
                            className="py-2 bg-gradient-to-r from-blue-200 to-blue-300 border-2 border-blue-300 active:text-black text-black font-semibold rounded-md hover:scale-105 px-8 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                        >
                            Upload
                        </NavLink>
                    </div>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        name="billingFirstName"
                        placeholder="Filter by Billing First Name"
                        value={filters.billingFirstName}
                        onChange={handleFilterChange}
                        className="border placeholder-gray-500 border-gray-300 px-4 py-2 rounded mr-2"
                    />
                    <input
                        type="text"
                        name="billingLastName"
                        placeholder="Filter by Billing Last Name"
                        value={filters.billingLastName}
                        onChange={handleFilterChange}
                        className="border placeholder-gray-500 border-gray-300 px-4 py-2 rounded mr-2"
                    />
                    <input
                        type="text"
                        name="orderNumber"
                        placeholder="Filter by Order Number"
                        value={filters.orderNumber}
                        onChange={handleFilterChange}
                        className="border placeholder-gray-500 border-gray-300 px-4 py-2 rounded mr-2"
                    />
                    <div>
                        <label> Filter by Order date: </label>
                        <label> From </label>
                        <input
                            type="date"
                            name="dateOrderedStart"
                            value={filters.dateOrderedStart}
                            onChange={handleFilterChange}
                            className="border border-gray-300 px-4 py-2 rounded mr-2"
                        />
                        <label>To </label>
                        <input
                            type="date"
                            name="dateOrderedEnd"
                            value={filters.dateOrderedEnd}
                            onChange={handleFilterChange}
                            className="border border-gray-300 px-4 py-2 rounded mr-2 mt-2"
                        />
                    </div>
                    <div>
                        <label> Filter by Due Date: </label>
                        <label> From </label>
                        <input
                            type="date"
                            name="dateDueStart"
                            value={filters.dateDueStart}
                            onChange={handleFilterChange}
                            className="border border-gray-300 px-4 py-2 rounded mr-2 mt-2"
                        />
                        <label>To </label>
                        <input
                            type="date"
                            name="dateDueEnd"
                            value={filters.dateDueEnd}
                            onChange={handleFilterChange}
                            className="border border-gray-300 px-4 py-2 rounded"
                        />
                    </div>
                </div>

                {loading && (
                    <div className="my-4 bg-blue-200 text-green-800 py-2 px-4 rounded">
                        Loading...
                    </div>
                )}

                {!loading && invoicesQuotes.length === 0 && (
                    <div className="my-4 mt-10 bg-blue-200 text-yellow-800 py-2 px-4 rounded">
                        No data available
                    </div>
                )}

                <table className="table-auto w-full border border-gray-300 bg-white mt-10 ">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border bg-blue-100 border-gray-300 px-4 py-2">
                                <input
                                    type="checkbox"
                                    checked={selectedInvoices.length === invoicesQuotes.length}
                                    onChange={handleSelectAll}
                                    className="mr-2"
                                />
                                {/* Select All */}
                            </th>
                            <th className="border bg-blue-100 border-gray-300 px-4 py-3">Order Number</th>
                            <th className="border bg-blue-100 border-gray-300 px-4 py-3">Type</th>

                            {/* <th>Billing First Name</th> */}
                            <th className="border bg-blue-100 border-gray-300 px-4 py-3"> Name</th>
                            {/* <th>Billing Last Name</th> */}
                            <th className="border bg-blue-100 border-gray-300 px-4 py-3">Date Ordered</th>
                            <th className="border bg-blue-100 border-gray-300 px-4 py-3">Date Due</th>
                            <th className="border bg-blue-100 border-gray-300 px-4 py-3">Payment Due</th>
                            <th className="border bg-blue-100 border-gray-300 px-4 py-3">Order Total</th>
                            <th className="border bg-blue-100 border-gray-300 px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoicesQuotes.map((invoice) => (
                            <tr key={invoice.uniqueKey} className="border-t text-center">
                                <td className="border border-gray-300 px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedInvoices.includes(invoice.uniqueKey)}
                                        onChange={() => handleSelectInvoice(invoice.uniqueKey)}
                                    />
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
                                    <Link
                                        to={`/edit/${invoice.uniqueKey}`}
                                        className="text-blue-500 hover:underline mr-4"
                                        >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(invoice.uniqueKey)}
                                        className="text-red-500 hover:underline ml-4"
                                        >
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
