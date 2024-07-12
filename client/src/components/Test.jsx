import React from 'react';
import { jsPDF } from 'jspdf';

const Test = () => {
  const generatePdf = () => {
    // Create a new instance of jsPDF
    const doc = new jsPDF();

    // Add some text to the PDF
    doc.text("Hello world!", 10, 10);

    // Generate PDF as Blob
    const pdfBlob = doc.output('blob');

    // Create a URL for the Blob
    const url = URL.createObjectURL(pdfBlob);

    // Open the PDF in a new tab
    window.open(url);
  };

  return (
    <div>
      <button onClick={generatePdf}>Generate PDF</button>
    </div>
  );
};

export default Test;
