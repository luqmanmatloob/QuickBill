import React, { useState } from 'react';
import dotenv from  'dotenv'


const InvoiceManagement = () => {
    const [file, setFile] = useState(null);
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceData, setInvoiceData] = useState(null);

    const BASE_URL = process.env.REACT_APP_BASE_URL;
    
    console.log(process.env.REACT_APP_BASE_URL)
    console.log(BASE_URL)

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('csvFile', file);

        try {
            const response = await fetch(`${BASE_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            setFile(null);

            alert('File uploaded successfully');
        } catch (error) {
            console.error(error);
            alert('An error occurred while uploading the file');
        }
    };

    const handleLookup = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${BASE_URL}/invoice/${invoiceNumber}`);
            const invoiceData = await response.json();

            setInvoiceData(invoiceData);
        } catch (error) {
            console.error(error);
            alert('An error occurred while processing the request');
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6">Invoice Management</h1>
            <h2 className="text-2xl font-semibold mb-4">Upload CSV File</h2>
            <form className="mb-6" onSubmit={handleUpload} encType="multipart/form-data">
                <input type="file" name="csvFile" accept=".csv" required onChange={handleFileChange} className="mb-2" />
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Upload</button>
            </form>

            <hr className="my-8" />

            <h2 className="text-2xl font-semibold mb-6">Lookup Invoice</h2>
            <form className="mb-6" onSubmit={handleLookup}>
                <label htmlFor="invoiceNumber" className="block mb-2">Enter Invoice Number:</label>
                <input type="text" id="invoiceNumber" name="invoiceNumber" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required className="mb-2 border border-gray-300 rounded-md px-4 py-2" />
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Lookup</button>
            </form>

            {invoiceData && (
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Invoice Data</h2>
                    <div className="border border-gray-300 p-4">
                        <p className="mb-2"><strong>Invoice Number:</strong> {invoiceData.invoiceNumber}</p>
                        <p className="mb-2"><strong>Date Ordered:</strong> {invoiceData.dateOrdered}</p>
                        <p className="mb-2"><strong>Date Due:</strong> {invoiceData.dateDue}</p>
                        <p className="mb-2"><strong>Total:</strong> {invoiceData.total}</p>
                        <h3 className="text-xl font-semibold mb-2">Items:</h3>
                        <ul>
                            {invoiceData.items.map(item => (
                                <li key={item.productName} className="mb-1">{item.productName} - Quantity: {item.quantity}, Unit Price: {item.unitPrice}, Total Price: {item.totalPrice}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <button onClick={() => window.print()} className="print-button bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">Print Invoice</button>
        </div>
    );
};

export default InvoiceManagement;
