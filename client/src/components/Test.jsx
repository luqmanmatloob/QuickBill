import React, { useState } from 'react';

const Test = () => {
  const [visible, setVisible] = useState(null);

  const handleClick = (index) => {
    setVisible(visible === index ? null : index);
  };

  const mapData = [1, 2, 3]; // Example data to iterate over

  return (

    <div className="flex flex-col space-y-4 ml-56 mt-28">
      {mapData.map((item, index) => (
        <div key={index} className="relative p-4 border border-gray-300 rounded-lg">
          <button
            onClick={() => handleClick(index)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Toggle Popup {item}
          </button>
          {visible === index && (
            <div className="absolute top-0 left-0 w-full mt-2 p-4 bg-white border border-gray-300 rounded shadow-lg">
              This is the popup content for item {item}.
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Test;
