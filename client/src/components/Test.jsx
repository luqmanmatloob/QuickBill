import React, { useState, useEffect } from 'react';

const Test = () => {
  const parseSizeString = (sizeString) => {
    // Ensure sizeString is a string and not empty
    if (!sizeString || typeof sizeString !== 'string') {
      console.error('Invalid input: sizeString should be a non-empty string');
      return {}; // Return an empty object if the input is invalid
    }
  
    // Initialize the size data object
    const sizeData = {
      sQty: 0, sPrice: 0, sTotal: 0,
      mQty: 0, mPrice: 0, mTotal: 0,
      lQty: 0, lPrice: 0, lTotal: 0,
      xlQty: 0, xlPrice: 0, xlTotal: 0,
      '2xlQty': 0, '2xlPrice': 0, '2xlTotal': 0,
      '3xlQty': 0, '3xlPrice': 0, '3xlTotal': 0,
      '4xlQty': 0, '4xlPrice': 0, '4xlTotal': 0,
      '5xlQty': 0, '5xlPrice': 0, '5xlTotal': 0
    };
  
    // Split the string into individual size entries
    const sizeEntries = sizeString.split(',').map(entry => entry.trim());
    
    sizeEntries.forEach(entry => {
      // Split by 'x' and trim parts
      const [size, quantityPart] = entry.split('x').map(part => part.trim());
      // Ensure quantity is a valid number
      const quantity = parseInt(quantityPart, 10) || 0;
      
      // Map size to the corresponding sizeData field
      switch (size) {
        case 'Small':
          sizeData.sQty = quantity;
          break;
        case 'Medium':
          sizeData.mQty = quantity;
          break;
        case 'Large':
          sizeData.lQty = quantity;
          break;
        case 'X Large':
          sizeData.xlQty = quantity;
          break;
        case '2X Large':
          sizeData['2xlQty'] = quantity;
          break;
        case '3X Large':
          sizeData['3xlQty'] = quantity;
          break;
        case '4X Large':
          sizeData['4xlQty'] = quantity;
          break;
        case '5X Large':
          sizeData['5xlQty'] = quantity;
          break;
        default:
          console.warn(`Unknown size: ${size}`);
          break;
      }
    });
  
    return sizeData;
  };
  
  useEffect(() => {
    const test = parseSizeString('Small x 1, Medium x 3, Large x 9, X Large x 6, 2X Large x 3');
    console.log(test);
  }, []);

  return (
    <div className="ml-56 mt-28 flex flex-col space-y-4">
    </div>
  );
};

export default Test;
