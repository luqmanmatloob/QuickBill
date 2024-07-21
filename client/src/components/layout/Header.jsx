import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFileInvoice } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";




const Header = () => {
  return (
    <div className="bg-[#f5faff] py-3 fixed top-0 right-0 left-0 z-50 border-[#d1e4f5] border-b-2">
      <div className=" mx-auto px-8 flex justify-between items-center">
        <div className='flex gap-2 '>

          <FaFileInvoice
            className="text-2xl font-extrabold text-blue-400"
          />

          <NavLink to="/" className="text-2xl font-bold text-black font-Josefin-Sans">
            AmazingInvoice
          </NavLink>
        </div>

        <div className='px-5 py-2  bg-blue-100 hover:bg-blue-300 rounded-md flex items-center gap-2'>
          <NavLink to="/" className='font-bold mt-1 font-Josefin-Sans uppercase text-sm cursor-pointers'>
            Account
          </NavLink>
          <IoPersonOutline  className='text-lg font-semibold mb-1'/>

        </div>
      </div>
    </div>
  );
};

export default Header;
