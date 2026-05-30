import React, { useState } from 'react';

import { NavLink } from 'react-router-dom';

import { FaPencilAlt } from 'react-icons/fa';
import { IoMdPerson } from 'react-icons/io';
import { FaFileInvoice } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';
import { FaFileUpload } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const [toggleUploads, setToggleUploads] = useState(false);

  const toggleUploadState = () => {
    setToggleUploads(!toggleUploads);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="text-bases custom-scrollbar fixed bottom-0 left-0 top-[64px] z-40 h-full max-h-[110vh] w-56 overflow-auto border-r border-[#6D8196] bg-gradient-to-b from-[#384959] to-[#4A5A6A] py-6 pl-3 pr-3 text-[#F8FAFC] shadow-lg flex flex-col">
      <ul className="flex flex-col space-y-2 text-sm font-medium flex-grow">
        <li className="group">
          <NavLink
            exact
            to="/dashboard"
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 hover:bg-[#6A89A7] hover:text-[#F8FAFC] hover:shadow-md active:scale-95 ${isActive ? 'bg-[#6A89A7] text-[#F8FAFC] shadow-md ring-2 ring-[#88BDF2]' : ''}`}
          >
            <FaHome className="text-lg transition-transform duration-200 group-hover:scale-110" />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li className="group">
          <NavLink
            exact
            to="/"
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 hover:bg-[#6A89A7] hover:text-[#F8FAFC] hover:shadow-md active:scale-95 ${isActive ? 'bg-[#6A89A7] text-[#F8FAFC] shadow-md ring-2 ring-[#88BDF2]' : ''}`}
          >
            <FaPencilAlt className="text-lg transition-transform duration-200 group-hover:scale-110" />
            <span>Create</span>
          </NavLink>
        </li>
        <li className="group">
          <NavLink
            exact
            to="/customer"
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 hover:bg-[#6A89A7] hover:text-[#F8FAFC] hover:shadow-md active:scale-95 ${isActive ? 'bg-[#6A89A7] text-[#F8FAFC] shadow-md ring-2 ring-[#88BDF2]' : ''}`}
          >
            <IoMdPerson className="text-lg transition-transform duration-200 group-hover:scale-110" />
            <span>Customer</span>
          </NavLink>
        </li>
        <li className="group">
          <NavLink
            exact
            to="/InvoiceQuotesListPage"
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 hover:bg-[#6A89A7] hover:text-[#F8FAFC] hover:shadow-md active:scale-95 ${isActive ? 'bg-[#6A89A7] text-[#F8FAFC] shadow-md ring-2 ring-[#88BDF2]' : ''}`}
          >
            <FaFileInvoice className="text-lg transition-transform duration-200 group-hover:scale-110" />
            <span>Invoices</span>
          </NavLink>
        </li>
        <li className="group">
          <NavLink
            exact
            to="/paymentslistpage"
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 hover:bg-[#6A89A7] hover:text-[#F8FAFC] hover:shadow-md active:scale-95 ${isActive ? 'bg-[#6A89A7] text-[#F8FAFC] shadow-md ring-2 ring-[#88BDF2]' : ''}`}
          >
            <FaFileInvoice className="text-lg transition-transform duration-200 group-hover:scale-110" />
            <span>Payments</span>
          </NavLink>
        </li>

        <li className="group">
          <NavLink
            exact
            to="/setting"
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 hover:bg-[#6A89A7] hover:text-[#F8FAFC] hover:shadow-md active:scale-95 ${isActive ? 'bg-[#6A89A7] text-[#F8FAFC] shadow-md ring-2 ring-[#88BDF2]' : ''}`}
          >
            <IoSettings className="text-lg transition-transform duration-200 group-hover:scale-110" />
            <span>Settings</span>
          </NavLink>
        </li>

        <li className="group">
          <button
            onClick={toggleUploadState}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 hover:bg-[#6A89A7] hover:text-[#F8FAFC] hover:shadow-md active:scale-95"
          >
            <FaFileUpload className={`text-lg transition-transform duration-200 ${toggleUploads ? 'rotate-180' : ''} group-hover:scale-110`} />
            <span>Upload</span>
          </button>
        </li>

        <div className={`${toggleUploads ? 'block' : 'hidden'} ml-2 space-y-1 border-l-2 border-[#88BDF2] pl-3`}>
          <li className="group">
            <NavLink
              exact
              to="/uploadPage"
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-[#6A89A7] hover:text-[#F8FAFC] active:scale-95 ${isActive ? 'bg-[#6A89A7] text-[#F8FAFC] ring-2 ring-[#88BDF2]' : ''}`}
            >
              <FaFileUpload className="text-base transition-transform duration-200 group-hover:scale-110" />
              <span>Upload Orders</span>
            </NavLink>
          </li>
          <li className="group">
            <NavLink
              exact
              to="/uploadpaymentspage"
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-[#6A89A7] hover:text-[#F8FAFC] active:scale-95 ${isActive ? 'bg-[#6A89A7] text-[#F8FAFC] ring-2 ring-[#88BDF2]' : ''}`}
            >
              <FaFileUpload className="text-base transition-transform duration-200 group-hover:scale-110" />
              <span>Upload Payments</span>
            </NavLink>
          </li>
        </div>
      </ul>

      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-xl border-2 border-red-400 px-4 py-3 mb-14 text-base font-semibold text-red-400 transition-all duration-200 hover:bg-red-400 hover:text-white hover:shadow-md active:scale-95"
      >
        <FaSignOutAlt className="text-lg transition-transform duration-200 group-hover:scale-110" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
