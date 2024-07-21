import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const InvoiceQuotesList = () => {
    const [invoicesQuotes, setInvoicesQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [printBtn, setPrintBtn] = useState(false);



    useEffect(() => {
        if (selectedInvoices.length > 0) {
            setPrintBtn(true);
        } else {
            setPrintBtn(false);
        }
    }, [selectedInvoices]);

    useEffect(() => {
        fetchInvoicesQuotes();
    }, []);

    const fetchInvoicesQuotes = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/invoicequote/allInvoicesQuotes`);

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log(data)
            setLoading(false)
            const reversedData = data.data.reverse();
            setInvoicesQuotes(reversedData);
        } catch (error) {
            console.error('Error fetching invoices and quotes:', error);
        }
    };

    // Function to format date into readable format
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
            setInvoicesQuotes(invoicesQuotes.filter(item => item.uniqueKey !== uniqueKey));
        } catch (error) {
            console.error('Error deleting invoice/quote:', error);
        }
    };
    const handleSelectInvoice = (uniqueKey) => {
        if (selectedInvoices.includes(uniqueKey)) {
            setSelectedInvoices(selectedInvoices.filter(key => key !== uniqueKey));
            console.log(selectedInvoices)
        } else {
            setSelectedInvoices([...selectedInvoices, uniqueKey]);
        }
    };




    return (
        <div className="ml-60 mr-5 mt-32">
            <div className="
        container p-6 mx-auto bg-white rounded-lg shadow-2xl  my-5 border-b-slate-300 border-solid border-2 border-[#f1f1f1] border-r-[#d1e4f5] border-l-[#d1e4f5]"
            >
                <div className='flex justify-between items-center mb-5'>
                    <h1 className="text-3xl font-bold mb-4">All Invoices/Quotes</h1>

                    <div className='flex justify-between items-center       '>
                        <button className='bg-[#6539c0] hover:bg-purple-500 text-white px-6 py-[7px] rounded hidden'>
                            Sort
                        </button>

                        {printBtn &&
                            (<Link to={`/print/${selectedInvoices}`} target='_blank' className=" bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mx-3">
                                Print
                            </Link>)
                        }

                        {!printBtn &&
                            (<Link className=" bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded mx-3">
                                Please Select to Print
                            </Link>)
                        }


                    </div>
                </div>
                {loading && (
                    <div className="my-4 bg-green-200 text-green-800 py-2 px-4 rounded">
                        Loading Invoices ...
                    </div>
                )}




                <table className="table-auto w-full border-collapse border border-gray-300 ">
                    <thead>
                        <tr className=" bg-gray-300">
                            <th className="border border-gray-300 px-4 py-2">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedInvoices(invoicesQuotes.map(invoice => invoice.uniqueKey));
                                        } else {
                                            setSelectedInvoices([]);
                                        }
                                    }}
                                    checked={selectedInvoices.length === invoicesQuotes.length}
                                />
                            </th>
                            {/* <th className="border border-gray-300 px-4 py-2">Unique Key</th> */}
                            <th className="border border-gray-300 px-4 py-2">Order Number </th>
                            <th className="border border-gray-300 px-4 py-2">Type</th>
                            <th className="border border-gray-300 px-4 py-2">Date Ordered</th>
                            {/* <th className="border border-gray-300 px-4 py-2">Date Due</th> */}
                            <th className="border border-gray-300 px-4 py-2">Order Total</th>
                            <th className="border border-gray-300 px-4 py-2">Edit</th>
                            <th className="border border-gray-300 px-4 py-2">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoicesQuotes.map((invoiceQuote, index) => (
                            <tr key={invoiceQuote._id} className={`bg-white text-center ${index % 2 === 0 ? '' : 'bg-[#f1f1f1]'}`}>
                                <td className="border border-gray-300 px-4 py-2">
                                    <input
                                        type="checkbox"
                                        onChange={() => handleSelectInvoice(invoiceQuote.uniqueKey)}
                                        checked={selectedInvoices.includes(invoiceQuote.uniqueKey)}
                                    />
                                </td>

                                {/* <td className="border border-gray-300 px-4 py-2">{invoiceQuote.uniqueKey}</td> */}
                                <td className="border border-gray-300 px-4 py-2">{invoiceQuote.orderNumber}</td>
                                <td className="border border-gray-300 px-4 py-2">{invoiceQuote.type}</td>
                                <td className="border border-gray-300 px-4 py-2">{formatDate(invoiceQuote.dateOrdered)}</td>
                                {/* <td className="border border-gray-300 px-4 py-2">{formatDate(invoiceQuote.dateDue)}</td> */}
                                <td className="border border-gray-300 px-4 py-2">{invoiceQuote.orderTotal}</td>
                                <td className="border border-gray-300 px-4 py-2"><Link to={`/Edit/${invoiceQuote.uniqueKey}`} className="text-blue-500 hover:underline mr-4">Edit</Link></td>
                                <td className="border border-gray-300 px-4 py-2"><button onClick={() => handleDelete(invoiceQuote.uniqueKey)} className="text-red-500 hover:underline">Delete</button></td>

                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='mb-[60vh]'></div>
            </div>
        </div>
    );
};

export default InvoiceQuotesList;
