import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFileInvoice } from 'react-icons/fa';
import { IoPersonOutline } from 'react-icons/io5';

import { useState } from 'react';

const Header = () => {

  const [toggleAccount, setToggleAccount] = useState(false);

  const handleToggleAccount = () => {
    if (toggleAccount) {
      setToggleAccount(false);
    } else {
      setToggleAccount(true);
    }
  };






  return (
    <div className="fixed left-0 right-0 top-0 z-50 border-b-2 border-[#d1e4f5] bg-[#f5faff] py-3">
      <div className="mx-auto flex items-center justify-between px-8">
        <div className="flex gap-2">
          <FaFileInvoice className="text-2xl font-extrabold text-blue-400" />

          <NavLink to="/" className="font-Josefin-Sans text-2xl font-bold text-black">
            AmazingInvoice
          </NavLink>
        </div>


        <div>
          <button className="relative flex items-center gap-2 rounded-md bg-blue-100 px-5 py-2 hover:bg-blue-300 font-Josefin-Sans cursor-pointers mt-1 text-sm font-bold uppercase"

            onClick={handleToggleAccount}>
            Account
            <IoPersonOutline className="mb-1 text-lg font-semibold" />
          </button>

          <div className={`${toggleAccount ? 'block' : 'hidden'} ml-4 absolute right-8 top-[65px] bg-[#f5faff]  shadow-xl p-9 `}>
            <div className='font-semibold hover:text-[#2046cf] hover:underline text-blue-600'>
            <NavLink to="/accountsettings" >
              <li className='list-none underline mb-3 cursor-pointer'>
                Settings
              </li>
              </NavLink>


              <li
                onClick={
                  () => {
                    localStorage.clear();
                    window.location.href = '/login';
                  }
                }
              className='list-none underline text-start cursor-pointer'>
                Logout
              </li>

            </div>
          </div>

        </div>


      </div>
    </div>
  );
};

export default Header;
