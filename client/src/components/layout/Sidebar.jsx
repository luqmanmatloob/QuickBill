import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPencilAlt } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { FaFileInvoice } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { FaFileUpload } from "react-icons/fa";






const Sidebar = () => {
    return (
        <div className="bg-white text-[#3952ac] pl-2 text-bases py-4 fixed left-0 top-[64px] bottom-0 z-40 w-52 border-[#d1e4f5] border-r-[1px] max-h-[110vh] h-full overflow-auto custom-scrollbar">
            <ul className="flex flex-col my-8 space-y-4 font-semibold text-sm">
                <li className='flex gap-2 py-2 px-4 hover:text-[#2046cf] hover:underline font-semibold text-lg items-center '>
                    <FaPencilAlt className='text-blue-400' />
                    <NavLink exact to="/" className="" activeClassName="font-bold">
                        Create
                    </NavLink>
                </li>
                <li className='flex gap-2 py-2 px-4 hover:text-[#2046cf] hover:underline font-semibold text-lg items-center '>
                    <IoMdPerson className='text-blue-400' />

                    <NavLink exact to="/customer" className="" activeClassName="font-bold">
                        Customer
                    </NavLink>
                </li>
                <li className='flex gap-2 py-2 px-4 hover:text-[#2046cf] hover:underline font-semibold text-lg items-center '>
                    <FaFileInvoice className='text-blue-400' />

                    <NavLink exact to="/InvoiceQuotesListPage" className="" activeClassName="font-bold">
                        Invoices
                    </NavLink>
                </li>
                <li className='flex gap-2 py-2 px-4 hover:text-[#2046cf] hover:underline font-semibold text-lg items-center '>
                    <FaFileInvoice className='text-blue-400' />

                    <NavLink exact to="/paymentslistpage" className="" activeClassName="font-bold">
                        Payments
                    </NavLink>
                </li>

                <li className='flex gap-2 py-2 px-4 hover:text-[#2046cf] hover:underline font-semibold text-lg items-center '>
                    <IoSettings className='text-blue-400' />

                    <NavLink exact to="/setting" className="" activeClassName="font-bold">
                        Settings
                    </NavLink>
                </li>
                <li className='flex gap-2 py-2 px-4 hover:text-[#2046cf] hover:underline font-semibold text-lg items-center '>
                    <FaFileUpload className='text-blue-400' />

                    <NavLink exact to="/uploadPage" className="" activeClassName="font-bold">
                        Upload
                    </NavLink>
                </li>
                <li className='flex gap-2 py-2 px-4 hover:text-[#2046cf] hover:underline font-semibold text-lg items-center '>
                    <FaFileUpload className='text-blue-400' />

                    <NavLink exact to="/uploadpaymentspage" className="" activeClassName="font-bold">
                        Upload Payments
                    </NavLink>
                </li>


            </ul>
        </div>
    );
};

export default Sidebar;
