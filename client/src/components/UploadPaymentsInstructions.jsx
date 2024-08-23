import React from 'react';

const UploadPaymentsInstructions = ({ children }) => {
    const handleDownload = () => {
        const fileUrl = `${process.env.PUBLIC_URL}/sampleFiles/dummy_data_Online_version_payment.csv`; // Update the file name accordingly
        console.log(`file url ${fileUrl}`)
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', 'dummy_data_Online_version_payment.csv'); // Force the browser to download the CSV file
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
            <p className='absolute bottom-5 right-[25%] text-red-400'> Component under development, More details about instructinos coming soon.</p>

            <h3 className="font-Josefin-Sans text-2xl text-center font-bold text-[#3952ac]">Payments CSV file Format Instructions</h3>

            <p className='mt-7'> follow the file format of the following file</p>

            <button
                onClick={handleDownload}
                className='rounded-md  py-2  font-semibold text-blue-400 underline hover:text-blue-500'
            >Download CSV File
            </button>
        </div>
    );
};

export default UploadPaymentsInstructions;

