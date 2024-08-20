import React, { useState } from 'react';

const Test = () => {
  const [visible, setVisible] = useState(null);

  const handleClick = (index) => {
    setVisible(visible === index ? null : index);
  };

  const mapData = [1, 2, 3]; // Example data to iterate over

  return (
    <div className="ml-56 mt-28 flex flex-col space-y-4">
      {mapData.map((item, index) => (
        <div key={index} className="relative rounded-lg border border-gray-300 p-4">
          <button onClick={() => handleClick(index)} className="rounded bg-blue-500 px-4 py-2 text-white">
            Toggle Popup {item}
          </button>
          {visible === index && <div className="absolute left-0 top-0 mt-2 w-full rounded border border-gray-300 bg-white p-4 shadow-lg">This is the popup content for item {item}.</div>}
        </div>
      ))}
    </div>
  );
};

export default Test;
