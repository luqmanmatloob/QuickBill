import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation


const BASE_URL = process.env.REACT_APP_BASE_URL;

const InvoiceQuotesList = () => {
    const [invoicesQuotes, setInvoicesQuotes] = useState([]);

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
            const reversedData = data.data.reverse();
            setInvoicesQuotes(reversedData);
        } catch (error) {
            console.error('Error fetching invoices and quotes:', error);
        }
    };

    // Function to format date into human-readable format
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
                body: JSON.stringify({ uniqueKey }), // Adjust to match your backend endpoint's expectations
            });
            if (!response.ok) {
                throw new Error('Failed to delete data');
            }
            setInvoicesQuotes(invoicesQuotes.filter(item => item.uniqueKey !== uniqueKey));
        } catch (error) {
            console.error('Error deleting invoice/quote:', error);
        }
    };

    return (
        <div className="
        container p-6 mx-auto bg-white rounded-lg shadow-2xl  my-5 border-b-slate-300 border-solid border-2"
        >
            <h1 className="text-3xl font-bold mb-4">All Invoices/Quotes</h1>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        {/* <th className="border border-gray-300 px-4 py-2">Unique Key</th> */}
                        <th className="border border-gray-300 px-4 py-2">Order Number </th>
                        <th className="border border-gray-300 px-4 py-2">Type</th>
                        <th className="border border-gray-300 px-4 py-2">Date Ordered</th>
                        {/* <th className="border border-gray-300 px-4 py-2">Date Due</th> */}
                        <th className="border border-gray-300 px-4 py-2">Order Total</th>
                        <th className="border border-gray-300 px-4 py-2">Edit</th>
                        <th className="border border-gray-300 px-4 py-2">Delete</th>
                        {/* Add more headers as per your data structure */}
                    </tr>
                </thead>
                <tbody>
                    {invoicesQuotes.map((invoiceQuote) => (
                        <tr key={invoiceQuote._id} className="bg-white text-center">
                            {/* <td className="border border-gray-300 px-4 py-2">{invoiceQuote.uniqueKey}</td> */}
                            <td className="border border-gray-300 px-4 py-2">{invoiceQuote.orderNumber}</td>
                            <td className="border border-gray-300 px-4 py-2">{invoiceQuote.type}</td>
                            <td className="border border-gray-300 px-4 py-2">{formatDate(invoiceQuote.dateOrdered)}</td>
                            {/* <td className="border border-gray-300 px-4 py-2">{formatDate(invoiceQuote.dateDue)}</td> */}
                            <td className="border border-gray-300 px-4 py-2">{invoiceQuote.orderTotal}</td>
                            <td className="border border-gray-300 px-4 py-2"><Link to={`/Edit/${invoiceQuote.uniqueKey}`} className="text-blue-500 hover:underline mr-4">Edit</Link></td>
                            <td className="border border-gray-300 px-4 py-2"><button onClick={() => handleDelete(invoiceQuote.uniqueKey)} className="text-red-500 hover:underline">Delete</button></td>

                            {/* Render more data fields as needed */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceQuotesList;
