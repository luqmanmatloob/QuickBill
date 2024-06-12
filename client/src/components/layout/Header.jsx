import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <div className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Amazing Import</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <NavLink exact to="/" className="text-white hover:text-gray-300" activeClassName="font-bold">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/upload" className="text-white hover:text-gray-300" activeClassName="font-bold">
                Upload
              </NavLink>
            </li>
            <li>
              <NavLink to="/setting" className="text-white hover:text-gray-300" activeClassName="font-bold">
                Setting
              </NavLink>
            </li>
            <li>
              <NavLink to="/" className="text-white hover:text-gray-300" activeClassName="font-bold">
                bulk print
              </NavLink>
            </li>
            <li>
              <NavLink to="/" className="text-white hover:text-gray-300" activeClassName="font-bold">
                Bukl download zip
              </NavLink>
            </li>  <li>
              <NavLink to="/" className="text-white hover:text-gray-300" activeClassName="font-bold">
                mail
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
