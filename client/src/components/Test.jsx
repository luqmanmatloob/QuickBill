import React, { Children } from 'react';

const Test = () => {
  const handleDownload = () => {
    const fileUrl = `${process.env.PUBLIC_URL}/sampleFiles/first_csv.csv`; // Update the file name accordingly
    console.log(`file url ${fileUrl}`)
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', 'first_csv.csv'); // Force the browser to download the CSV file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`fixed bottom-6 left-0 right-0 top-3 z-50 mx-40 my-10 overflow-auto rounded-lg border-2 border-solid border-b-slate-300 border-l-[#6539c0] border-r-[#6539c0] bg-white p-10 shadow-2xl transition-opacity duration-300 ease-in-out opacity-100 pointer-events-none`}
      style={{
        boxShadow: `0 25px 50px 600px rgba(0, 0, 0, 0.50)`
      }}
    >
      {Children}
      <button onClick={handleDownload}>Download CSV File</button>
    </div>
  );
};

export default Test;

