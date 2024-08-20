import React, { useState } from 'react';

import { NavLink } from 'react-router-dom';

import { FaPencilAlt } from 'react-icons/fa';
import { IoMdPerson } from 'react-icons/io';
import { FaFileInvoice } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';
import { FaFileUpload } from 'react-icons/fa';

const Sidebar = () => {
  const [toggleUploads, setToggleUploads] = useState(false);

  const toggleUploadState = () => {
    if (toggleUploads) {
      setToggleUploads(false);
    } else {
      setToggleUploads(true);
    }
  };

  return (
    <div className="text-bases custom-scrollbar fixed bottom-0 left-0 top-[64px] z-40 h-full max-h-[110vh] w-52 overflow-auto border-r-[1px] border-[#d1e4f5] bg-white py-4 pl-2 text-[#3952ac]">
      <ul className="my-8 flex flex-col space-y-4 text-sm font-semibold">
        <li className="flex items-center gap-2 px-4 py-2 text-lg font-semibold hover:text-[#2046cf] hover:underline">
          <FaPencilAlt className="text-blue-400" />
          <NavLink exact to="/" className="" activeClassName="font-bold">
            Create
          </NavLink>
        </li>
        <li className="flex items-center gap-2 px-4 py-2 text-lg font-semibold hover:text-[#2046cf] hover:underline">
          <IoMdPerson className="text-blue-400" />

          <NavLink exact to="/customer" className="" activeClassName="font-bold">
            Customer
          </NavLink>
        </li>
        <li className="flex items-center gap-2 px-4 py-2 text-lg font-semibold hover:text-[#2046cf] hover:underline">
          <FaFileInvoice className="text-blue-400" />

          <NavLink exact to="/InvoiceQuotesListPage" className="" activeClassName="font-bold">
            Invoices
          </NavLink>
        </li>
        <li className="flex items-center gap-2 px-4 py-2 text-lg font-semibold hover:text-[#2046cf] hover:underline">
          <FaFileInvoice className="text-blue-400" />

          <NavLink exact to="/paymentslistpage" className="" activeClassName="font-bold">
            Payments
          </NavLink>
        </li>

        <li className="flex items-center gap-2 px-4 py-2 text-lg font-semibold hover:text-[#2046cf] hover:underline">
          <IoSettings className="text-blue-400" />

          <NavLink exact to="/setting" className="" activeClassName="font-bold">
            Settings
          </NavLink>
        </li>

        <li className="flex items-center gap-2 px-4 py-2 text-lg font-semibold hover:text-[#2046cf] hover:underline">
          <FaFileUpload className="text-blue-400" />

          <button onClick={toggleUploadState} className="" activeClassName="font-bold">
            Upload
          </button>
        </li>
        <div className={`${toggleUploads ? 'block' : 'hidden'} ml-4`}>
          <li className="flex items-center gap-2 px-4 py-2 text-base font-semibold hover:text-[#2046cf] hover:underline">
            <FaFileUpload className="text-blue-400" />

            <NavLink exact to="/uploadPage" className="" activeClassName="font-semibod">
              Upload Orders
            </NavLink>
          </li>
          <li className="flex items-center gap-2 px-4 py-2 text-base font-semibold hover:text-[#2046cf] hover:underline">
            <FaFileUpload className="text-blue-400" />

            <NavLink exact to="/uploadpaymentspage" className="" activeClassName="font-semibold">
              Upload Payments
            </NavLink>
          </li>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;
