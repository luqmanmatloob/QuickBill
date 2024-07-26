import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const Print = ({ id }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [gettingsetting, setgettingsetting] = useState(false);
  const [gettinginvoices, setgettinginvoices] = useState(false);
  const [generatingpdf, setgeneratingpdf] = useState(false);
  const [success, setsuccess] = useState(false);
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



  const fetchSettings = async () => {
    try {
      setgettingsetting(true)
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
      setgettingsetting(false)


    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };


  const fetchInvoices = async () => {
    try {
      setgettinginvoices(true)
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
      setgettinginvoices(false)
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };


  const generatePdf = () => {
    setgeneratingpdf(true)

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



      doc.setTextColor(112, 112, 112); //   dark grey
      doc.setTextColor(105, 105, 105); //   grey 
      doc.setTextColor(200, 204, 203); //   border grey 
      doc.setTextColor(80, 80, 80); //   Items grey 

      doc.setTextColor(0, 0, 0); //  black


      doc.setFont('Helvetica', 'bolditalic');
      doc.setFontSize(20);
      doc.text(`${settings.companyName}`, 15, 15);
      doc.setFont('Helvetica', 'normal');

      doc.setFontSize(8);
      doc.text(`${settings.companyName} ${settings.phoneNumber}`, 15, 25);
      doc.text(`${settings.address}`, 15, 30);
      doc.text(`${settings.city} ${settings.state}`, 15, 35);
      doc.text(`${settings.country} `, 15, 40);
      doc.text(` ${settings.url}`, 15, 50);




      doc.setFontSize(15);
      doc.setFont('Helvetica', 'bold');


      doc.setTextColor(112, 112, 112); //   dark grey

      doc.text(`${invoice.type.toUpperCase()}`, 135, 15);


      doc.setTextColor(0, 0, 0); //  black
      doc.setFont('Helvetica', 'normal');



      doc.setFontSize(10);

      doc.text(`${invoice.type.toUpperCase()} # : ${invoice.orderNumber}`, 135, 22);

      doc.setFontSize(7);
      doc.text(`Shipping:         ${invoice.shippingMethod}`, 135, 30);
      doc.text(`Date Ordered:    ${new Date(invoice.dateOrdered).toLocaleDateString()}`, 135, 34);
      doc.text(`Date Due:          ${new Date(invoice.dateDue).toLocaleDateString()}`, 135, 38);


      doc.setTextColor(200, 204, 203); //   border grey 
      doc.setFontSize(35);
      doc.text(`_________________________`, 15, 55);
      doc.setTextColor(0, 0, 0); //  black



      // row 2 billing adress and shipping adress


      doc.setFontSize(8);
      doc.setFont('Helvetica', 'bold');

      doc.text('Billing Address:', 15, 65);


      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(105, 105, 105); //   grey 


      doc.text(`${invoice.billingFirstName} ${invoice.billingLastName}`, 15, 70);
      doc.text(`${invoice.billingAddress}`, 15, 75);
      doc.text(`${invoice.billingCity}, ${invoice.billingState}`, 15, 80);
      doc.text(`${invoice.billingEmailAddress}`, 15, 85);



      doc.setTextColor(0, 0, 0); //  black
      doc.setFontSize(8);
      doc.setFont('Helvetica', 'bold');
      doc.text('Shipping Address:', 115, 65);


      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(105, 105, 105); //   grey 

      doc.text(`${invoice.shippingFirstName}`, 115, 70);
      doc.text(`${invoice.shippingAddress}`, 115, 75);
      doc.text(`${invoice.shippingCity}, ${invoice.shippingState}`, 115, 80);
      doc.text(`${invoice.shippingPostcode}`, 115, 85);

      doc.setTextColor(0, 0, 0); //  black


      doc.setTextColor(158, 158, 158); //   border grey 
      doc.setFontSize(15);

      doc.setTextColor(200, 204, 203); //   border grey 
      doc.setFontSize(35);
      // doc.text(`_________________________`, 15, 90);
      doc.setTextColor(0, 0, 0); //  black



      // Line Items Table
      let startY = 100;

      // Table Headers
      doc.setFontSize(8);
      doc.setFont('Helvetica', 'bold');


      doc.text('Product', 15, startY);
      doc.text('Color', 75, startY);
      doc.text('Size/QTY', 90, startY);
      doc.text('Unit Price', 125, startY);
      doc.text('Tax', 145, startY);
      doc.text('Qty', 158, startY);
      doc.text('Total', 170, startY);

      doc.setTextColor(200, 204, 203); //   border grey 
      doc.setFontSize(20);
      doc.text(`____________________________________________`, 15, startY + 2);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80); //   Items grey 


      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80); //   Items grey 


      startY += 10;

      // Table Content
      invoice.items.forEach((item, itemIndex) => {
        const unitPrice = parseFloat(item.unitPrice) || 0;
        const lineQty = parseInt(item.lineQty) || 0;
        const lineTotal = unitPrice * lineQty;
        let tax = parseFloat(item.tax) || 0;
        tax = lineQty * tax;
        const taxExempt = item.taxExempt;
        tax = (taxExempt ? 0 : tax);

        subtotal += lineTotal;
        totalTax += tax;

        const yPosition = startY + itemIndex * 10;
        doc.text(`${item.productName}`, 15, yPosition);
        doc.text(`${item.color}`, 75, yPosition);
        doc.text(`${item.size}`, 90, yPosition, { maxWidth: 30 });
        doc.text(`$${item.unitPrice}`, 125, yPosition);
        doc.text(`$${item.tax.toFixed(1)}`, 145, yPosition);
        doc.text(`${item.lineQty}`, 158, yPosition);
        doc.text(`$${item.lineTotal}`, 170, yPosition);

        doc.setTextColor(200, 204, 203); //   border grey 
        doc.setFontSize(15);
        doc.text(`___________________________________________________________`, 15, yPosition + 3);
        doc.setTextColor(0, 0, 0); //  black
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(80, 80, 80); //   Items grey 


      });

      GrandTotal = subtotal + totalTax;

      // Totals
      const totalsY = startY + invoice.items.length * 10 + 10;

      doc.setFontSize(8);
      doc.setFont('Helvetica', 'bold');
      doc.text(`Subtotal:`, 140, totalsY);
      doc.text(`Total Tax:`, 140, totalsY + 10);
      doc.text(`Grand Total:`, 140, totalsY + 20);
      doc.text(`Payment Paid:`, 140, totalsY + 30);
      doc.text(`Balance Due:`, 140, totalsY + 40);


      doc.text(`$${subtotal.toFixed(2)}`, 165, totalsY);
      doc.text(`$${totalTax.toFixed(2)}`, 165, totalsY + 10);
      doc.text(`$${GrandTotal.toFixed(2)}`, 165, totalsY + 20);
      doc.text(`$${invoice.paymentPaid || ''}`, 165, totalsY + 30);
      doc.text(`$${GrandTotal - invoice.paymentPaid || 0}`, 165, totalsY + 40);

      doc.setFontSize(7);
      doc.setFont('Helvetica', 'normal');

      doc.text(`(All prices are shown in USD)`, 140, totalsY + 50);













    


      {
        doc.setTextColor(0, 0, 0); //  black
        doc.setFontSize(8);
        doc.setFont('Helvetica', 'bold');
        doc.text(`Terms:`, 15, totalsY, { maxWidth: 90 });

        doc.setTextColor(105, 105, 105); //   grey 
        doc.setFont('Helvetica', 'normal');
        doc.text(`${invoice.paymentTerms || ''}`, 15, totalsY + 5, { maxWidth: 90 });

      }

      {
        doc.setTextColor(0, 0, 0); //  black
        doc.setFontSize(8);
        doc.setFont('Helvetica', 'bold');
        doc.text(`Payment Date:`, 15, totalsY + 12, { maxWidth: 90 });

        doc.setTextColor(105, 105, 105); //   grey 
        doc.setFont('Helvetica', 'normal');
        doc.text(`${invoice.paymentDates || ''}`, 15, totalsY + 17, { maxWidth: 90 });
      }



{
      doc.setTextColor(0, 0, 0); //  black
      doc.setFontSize(8);
      doc.setFont('Helvetica', 'bold');
      doc.text(`Payment Method:`, 15, totalsY + 23, { maxWidth: 90 });
      doc.setFont('Helvetica', 'normal');

      doc.setTextColor(105, 105, 105); //   grey 
      doc.text(`${invoice.paymentMethod || ''}`, 15, totalsY + 28, { maxWidth: 90 });
}

{
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0); //  black

  doc.text(`Note:`, 15, totalsY+35, { maxWidth: 75 });

  doc.setTextColor(105, 105, 105); //   grey 
  doc.setFont('Helvetica', 'normal');
  doc.text(`${invoice.note}`, 15, totalsY+40, { maxWidth: 75 });
}




      doc.setTextColor(0, 0, 0); //  black
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(105, 105, 105); //   grey 


      doc.setTextColor(200, 204, 203); //   border grey 
      doc.setFontSize(17);
      doc.text(`__________________________`, 15, totalsY + 45);
      doc.setTextColor(0, 0, 0); //  black
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80); //   Items grey 

      doc.text(`'You are important to us. Your complete satisfaction is our intent. If you are happy with our service, tell all your friends. If you are disappointed, please tell us and we will do all in our power to make you happy.}`, 15, totalsY + 50, { maxWidth: 85 });
    });

  














    // Open the PDF in a new tab
    const pdfUrl = doc.output('bloburl');
    console.log('Generated PDF URL:', pdfUrl);
    setgeneratingpdf(false)
    setsuccess(true)

    // window.open('', '_self').close();
    window.open(pdfUrl, '_blank');
  };



  return (
    <div className="ml-40 mt-16">
      <div className='mx-auto max-w-5xl py-12'>
        <div className='bg-white rounded-lg shadow-xl p-8 border-r-blue-100 border-l-blue-100 border-solid border-2 min-h-[70vh]'>
          <p className="my-4 bg-blue-100 text-green-800 py-2 px-4 rounded text-center"> Please Make sure Pop ups are allowed</p>

          {gettingsetting && (
            <div className="my-4 bg-blue-100 text-green-800 py-2 px-4 rounded">
              Loading Info...
            </div>
          )}

          {gettinginvoices && (
            <div className="my-4 bg-blue-100 text-green-800 py-2 px-4 rounded">
              Loading Invoices & Quotes ...
            </div>
          )}

          {generatingpdf && (
            <div className="my-4 bg-blue-100 text-green-800 py-2 px-4 rounded">
              generating PDF...
            </div>
          )}

          {success && (
            <div className="my-4 bg-blue-100 text-green-800 py-2 px-4 rounded">
              PDF for Print Generated Successfully
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default Print;
