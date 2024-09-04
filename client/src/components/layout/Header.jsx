import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFileInvoice } from 'react-icons/fa';
import { IoPersonOutline } from 'react-icons/io5';

import { useState } from 'react';

const Header = () => {


  return (
    <div className="fixed left-0 right-0 top-0 z-50 border-b-2 border-[#d1e4f5] bg-[#f5faff] py-3">
      <div className="mx-auto flex items-center justify-between px-8">
        <div className="flex gap-2">
          <FaFileInvoice className="text-2xl font-extrabold text-blue-400" />

          <NavLink to="/" className="font-Josefin-Sans text-2xl font-bold text-black">
            AmazingInvoice
          </NavLink>
        </div>


        <div className='flex items-center justify-center gap-5'>

          <button
            onClick={
              () => {
                localStorage.clear();
                window.location.href = '/login';
              }
            }
            className=' font-semibold text-blue-600 hover:text-blue-700  text-start text-lg hover:underline cursor-pointer'>
            Logout
          </button>

          <NavLink to="/accountsettings" className="relative flex items-center gap-2 rounded-md bg-blue-100 px-5 py-2 hover:bg-blue-300 font-Josefin-Sans cursor-pointers mt-1 text-sm font-bold uppercase">
            Account
            <IoPersonOutline className="mb-1 text-lg font-semibold" />
          </NavLink>
        </div>


      </div>
    </div>
  );
};

export default Header;
