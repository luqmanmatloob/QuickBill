import React, { useState, useEffect } from 'react';

const Print = ({ id }) => {

  const BASE_URL = process.env.REACT_APP_BASE_URL;


  const fetchInvoices = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/invoicequote/getByUniqueKeys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uniqueKeys: id }),
      });
      const data = await response.json();
      console.log(data)

    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };



  useEffect(() => {
    fetchInvoices();
    console.log("sueeffect is running")
  });


  return (
    <div className='bg-blue-100 min-h-screen p-10 overflow-auto'>
      <div className='text-2xl text-red-600'>Component under development</div>
    </div>
  );
};

export default Print;
