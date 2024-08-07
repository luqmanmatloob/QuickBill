import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const Test = () => {
  const [generatingpdf, setgeneratingpdf] = useState(false);
  const [success, setsuccess] = useState(false);

  const generatePdf = () => {
    setgeneratingpdf(true);

    // For testing, use a local image from the public folder
    const testImageUrl = '/logo.png'; // Image path in the public folder

    const doc = new jsPDF({ format: 'letter' });

    doc.addImage(testImageUrl, 'PNG', 10, 10, 180, 160); // Adjust the format if necessary

    // Add some text to test the PDF
    doc.text('This is a test PDF with an image from the public folder.', 10, 180);

    // Open the PDF in a new tab
    const pdfUrl = doc.output('bloburl');
    console.log('Generated PDF URL:', pdfUrl);
    setgeneratingpdf(false);
    setsuccess(true);

    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="ml-60 mt-24">
      <button
        onClick={generatePdf}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Generate PDF
      </button>

      {generatingpdf && (
        <div className="my-4 bg-blue-100 text-green-800 py-2 px-4 rounded">
          Generating PDF...
        </div>
      )}

      {success && (
        <div className="my-4 bg-blue-100 text-green-800 py-2 px-4 rounded">
          PDF Generated Successfully
        </div>
      )}
    </div>
  );
};

export default Test;
