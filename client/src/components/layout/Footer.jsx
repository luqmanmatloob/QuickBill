import React from 'react';

const Footer = () => {
  return (
    <div className="relative mt-32">
      <div className="flex items-center justify-center border-t border-[#E4E7EB] bg-gradient-to-t from-[#F8FAFC] to-white py-6 text-[#0F172A] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-[#64748B]">© 2024 QuickBill</span>
          <span className="text-[#E4E7EB]">•</span>
          <span className="text-[#64748B]">All rights reserved</span>
          <span className="text-[#E4E7EB]">•</span>
          <button 
            className="text-[#2563EB] transition-colors duration-200 hover:text-[#1E3A5F] hover:underline cursor-pointer bg-transparent border-none p-0"
            aria-label="View Privacy Policy"
          >
            Privacy Policy
          </button>
          <span className="text-[#E4E7EB]">•</span>
          <button 
            className="text-[#2563EB] transition-colors duration-200 hover:text-[#1E3A5F] hover:underline cursor-pointer bg-transparent border-none p-0"
            aria-label="View Terms of Service"
          >
            Terms of Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
