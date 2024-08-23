import React, { useState, useEffect } from 'react';

const Test = () => {


  function parseProductInfo(productString) {
    // Check if the '-' symbol exists in the string
    if (productString.includes('-')) {
        // Split the string based on the '-' symbol
        const [code, name] = productString.split('-', 2);
        // Strip leading and trailing spaces from the name and code
        return [name.trim(), code.trim()];
    } else {
        // If '-' is not found, return the entire string as the name and an empty code
        return [productString.trim(), ''];
    }
}
  
  useEffect(() => {
    const [productName, productCode] = parseProductInfo('98789 - black shoes');
    console.log(`product name "${productName}" product code "${productCode}"`)

  }, []);

  return (
    <div className="ml-56 mt-28 flex flex-col space-y-4">
    </div>
  );
};

export default Test;
