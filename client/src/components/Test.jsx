import React, { useState } from 'react';

function Test() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex h-screen mt-56">
      <div className={`${isSidebarVisible ? 'block' : 'hidden'} fixed bg-blue-500 w-64 h-full p-4`}>
        <button
          onClick={toggleSidebar}
          className="bg-white text-blue-500 p-2 rounded"
        >
          Toggle Sidebar
        </button>
        <p className="text-white">Sidebar Content</p>
      </div>
      <div
        className={`flex-grow ml-${isSidebarVisible ? '64' : '0'} transition-all duration-300 bg-green-500 p-4`}
      >
        <button
          onClick={toggleSidebar}
          className="bg-white text-green-500 p-2 rounded mb-4"
        >
          Toggle Sidebar
        </button>
        <p className="text-white">Main Content</p>
      </div>
    </div>
  );
}

export default Test;
