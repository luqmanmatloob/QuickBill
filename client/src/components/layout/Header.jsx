import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFileInvoice } from 'react-icons/fa';
import { IoPersonOutline } from 'react-icons/io5';

const Header = () => {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 border-b border-[#6D8196] bg-gradient-to-r from-[#384959] to-[#4A5A6A] py-3 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex items-center justify-between px-8">
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <FaFileInvoice className="text-3xl font-extrabold text-[#BDDDFC] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
            <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-[#88BDF2] animate-pulse"></div>
          </div>
          <NavLink 
            to="/" 
            className="font-Josefin-Sans text-2xl font-bold text-[#F8FAFC] transition-all duration-200 hover:text-[#BDDDFC] hover:scale-105"
          >
            QuickBill
          </NavLink>
        </div>

        <div className='flex items-center justify-center gap-4'>
          <NavLink 
            to="/accountsettings" 
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6A89A7] to-[#88BDF2] px-5 py-2.5 text-sm font-bold uppercase text-[#F8FAFC] shadow-sm transition-all duration-300 hover:from-[#BDDDFC] hover:to-[#6A89A7] hover:text-[#384959] hover:shadow-lg active:scale-95"
          >
            <span>Account</span>
            <IoPersonOutline className="text-lg transition-transform duration-200 group-hover:scale-110" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Header;
