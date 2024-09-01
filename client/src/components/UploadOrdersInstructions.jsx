import React from 'react';

const UploadCsvInstructions = ({ children }) => {
  const handleDownload1 = () => {
    const fileUrl = `${process.env.PUBLIC_URL}/sampleFiles/dummy_data_invoices.csv`; // Update the file name accordingly
    console.log(`file url ${fileUrl}`)
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', 'dummy_data_invoices.csv'); // Force the browser to download the CSV file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
   const handleDownload2 = () => {
    const fileUrl = `${process.env.PUBLIC_URL}/sampleFiles/dummy_datra_3.csv`; // Update the file name accordingly
    console.log(`file url ${fileUrl}`)
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', 'dummy_datra_3.csv'); // Force the browser to download the CSV file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`fixed bottom-6 left-0 right-0 top-3 z-50 mx-40 my-10 overflow-auto rounded-lg border-2 border-solid border-b-slate-300 border-l-[#6539c0] border-r-[#6539c0] bg-white p-10 shadow-2xl`}
      style={{ boxShadow: `0 25px 50px 600px rgba(0, 0, 0, 0.50)` }}
    >
      <div className='absolute right-3 top-2'> {children} </div>
      {/* <p className='absolute bottom-5 right-[25%] text-red-400'> Component under development, More details about instructinos coming soon.</p> */}

      <h3 className="font-Josefin-Sans text-2xl text-center font-bold text-[#3952ac]">Invoices/Quote CSV file Format Instructions</h3>

      <p className='mt-7'> Kindly follow the following file formats only.</p>
      <button
        onClick={handleDownload1}
        className='block mt-5 rounded-md  py-2  font-semibold text-blue-400 underline hover:text-blue-500'
      >Download CSV File Format 1
      </button>   
       <button
        onClick={handleDownload2}
        className='rounded-md  py-2  font-semibold text-blue-400 underline hover:text-blue-500'
        >Download CSV File Format 2
      </button>
    </div>
  );
};

export default UploadCsvInstructions;

