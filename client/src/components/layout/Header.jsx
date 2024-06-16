import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <div className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-white">Amazing Import</NavLink>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <NavLink exact to="/" className="text-white hover:text-gray-300" activeClassName="font-bold">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/InvoiceQuotesListPage" className="text-white hover:text-gray-300" activeClassName="font-bold">
                Invoice
              </NavLink>
            </li>

            <li>
              <NavLink to="/setting" className="text-white hover:text-gray-300" activeClassName="font-bold">
                Setting
              </NavLink>
            </li>
            <li>
              <NavLink to="/uploadPage" className="text-white hover:text-gray-300" activeClassName="font-bold">
                Upload
              </NavLink>
            </li>
            <li>
              <NavLink to="/gonnabeoutsoon" className="text-white hover:text-gray-300" activeClassName="font-bold">
                bulk print
              </NavLink>
            </li>
            <li>
              <NavLink to="/gonnabeoutsoon" className="text-white hover:text-gray-300" activeClassName="font-bold">
                Bulk download zip
              </NavLink>
            </li>  <li>
              <NavLink to="/gonnabeoutsoon" className="text-white hover:text-gray-300" activeClassName="font-bold">
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
