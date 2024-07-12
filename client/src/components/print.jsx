import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const Print = ({ id }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [invoices, setInvoices] = useState([]);
  const [settings, setSettings] = useState({
    companyName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    url: ''
  });



  
  useEffect(() => {
    fetchSettings();
  }, [id]);

  useEffect(() => {
    fetchInvoices();
  }, [id]);

  useEffect(() => {
    if (invoices.length && Object.values(settings).every(value => value !== '')) {
      generatePdf();
    }
  }, [invoices, settings]);




  const fetchInvoices = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/invoicequote/getByUniqueKeys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uniqueKeys: id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched invoices:', data);
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };



  const fetchSettings = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/settings`);
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      // Set the settings from the fetched data
      setSettings({
        companyName: data.companyName || '',
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        url: data.url || ''
      });
      console.log(settings)

    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };





  const generatePdf = () => {
    if (!invoices.length) {
      console.log('No invoices to generate PDF');
      return;
    }

    const doc = new jsPDF();

    invoices.forEach((invoice, index) => {
      let subtotal = 0; // Declare subtotal here
      let totalTax = 0; // Declare totalTax here
      let GrandTotal = 0; // Declare GrandTotal here

      if (index > 0) doc.addPage();



      // row 1 company info and invoice info

      doc.setFontSize(15);
      doc.text(`${settings.companyName}`, 15, 15);
      doc.setFontSize(12);
      doc.text(`${settings.companyName} ${settings.phoneNumber}`, 15, 25);
      doc.text(`${settings.address}`, 15, 35);
      doc.text(`${settings.city} ${settings.state}`, 15, 45);
      doc.text(`${settings.country} ${settings.url}`, 15, 55);


      doc.setFontSize(15);
      doc.text(`${invoice.type} #:${invoice.orderNumber}`, 135, 15);
      doc.setFontSize(12);
      doc.text(`Shipping: ${invoice.shippingMethod}`, 135, 25);
      doc.text(`Date Ordered: ${new Date(invoice.dateOrdered).toLocaleDateString()}`, 135, 35);
      doc.text(`Date Due: ${new Date(invoice.dateDue).toLocaleDateString()}`, 135, 45);

      doc.text(`_______________________________________________________________________`, 15, 60);



      // row 2 billing adress and shipping adress


      doc.setFontSize(14);
      doc.text('Billing Address:', 15, 75);
      doc.setFontSize(12);
      doc.text(`${invoice.billingAddress}`, 15, 85);
      doc.text(`${invoice.billingCity}, ${invoice.billingState}`, 15, 95);
      doc.text(`${invoice.billingEmailAddress}`, 15, 105);

      doc.setFontSize(14);
      doc.text('Shipping Address:', 135, 75);
      doc.setFontSize(12);
      doc.text(`${invoice.shippingAddress}`, 135, 85);
      doc.text(`${invoice.shippingCity}, ${invoice.shippingState}`, 135, 95);
      doc.text(`${invoice.shippingPostcode}`, 135, 105);


      doc.text(`_______________________________________________________________________`, 15, 110);


      // Line Items Table
      let startY = 120;
      doc.setFontSize(14);
      doc.text('Items:', 15, startY);
      startY += 10;

      // Table Headers
      doc.setFontSize(12);
      doc.text('Product Name', 15, startY);
      doc.text('Quantity', 110, startY);
      doc.text('Unit Price', 130, startY);
      doc.text('Line Total', 160, startY);
      startY += 10;

      // Table Content
      invoice.items.forEach((item, itemIndex) => {
        const unitPrice = parseFloat(item.unitPrice) || 0;
        const lineQty = parseInt(item.lineQty) || 0;
        const lineTotal = unitPrice * lineQty;
        const tax = parseFloat(item.tax) || 0;
        const taxExempt = item.taxExempt;
        const taxAmount = taxExempt ? 0 : (lineTotal * tax) / 100;

        subtotal += lineTotal;
        totalTax += taxAmount;
        GrandTotal = subtotal + totalTax;

        const yPosition = startY + itemIndex * 10;
        doc.text(`${item.productName}`, 15, yPosition);
        doc.text(`${item.lineQty}`, 110, yPosition);
        doc.text(`${item.unitPrice}`, 130, yPosition);
        doc.text(`${item.lineTotal}`, 160, yPosition);
      });

      // Totals
      const totalsY = startY + invoice.items.length * 10 + 10;

      doc.setFontSize(12);
      doc.text(`Subtotal:      ${subtotal.toFixed(2)}`, 130, totalsY);
      doc.text(`Tax:           ${totalTax.toFixed(2)}`, 130, totalsY + 5);
      doc.text(`Grand Total:   ${GrandTotal.toFixed(2)}`, 130, totalsY + 10);

      // Footer Note
      doc.setFontSize(10);
      doc.text(`Note: ${invoice.note}`, 15, totalsY, { maxWidth: 90 });
    });

    // Open the PDF in a new tab
    const pdfUrl = doc.output('bloburl');
    console.log('Generated PDF URL:', pdfUrl);

    window.open('', '_self').close();
    window.open(pdfUrl, '_blank');
  };



  return <div></div>;
};

export default Print;
