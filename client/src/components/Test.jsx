import React from 'react';
import jsPDF from 'jspdf';

const GeneratePdf = () => {
  const generatePdf = () => {
    const doc = new jsPDF();

    // Set background color for the entire page
    doc.setFillColor(240, 240, 240); // Light gray color
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');

    // Add text with custom styling
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 255); // Blue color
    doc.text("Hello World!", 20, 30);

    // Add another line of text with different styling
    doc.setFont("helvetica", "italic");
    doc.setFontSize(16);
    doc.setTextColor(255, 0, 0); // Red color
    doc.text("This is a PDF created with jsPDF.", 20, 50);

    // Save the document and open in a new tab
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    window.open(url);
  };

  return (
    <div>
      <button onClick={generatePdf}>Generate PDF</button>
    </div>
  );
};

export default GeneratePdf;

