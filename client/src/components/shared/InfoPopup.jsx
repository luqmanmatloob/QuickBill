import React, { useState } from 'react';
import { MdOutlineQuestionMark } from "react-icons/md";

const InfoPopup = ({ text }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    return (
        <div className="relative z-[1000]">
            <div
                onClick={() => setIsPopupOpen(true)}
                className="cursor-pointer font-bold text-lg text-gray-500 hover:text-gray-700"
                title="Help"
            >
            <MdOutlineQuestionMark className='text-blue-500 hover:text-blue-700'/>
            </div>

            {/* Popup */}
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <p className="text-gray-700">
                            {text}
                        </p>
                        <button
                            onClick={() => setIsPopupOpen(false)}
                            className="mt-7 min-w-full rounded-md border-2 border-blue-300 bg-gradient-to-l from-blue-300 to-blue-200 px-4 py-2 font-bold text-gray-800 hover:scale-105 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none active:text-black"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoPopup;
