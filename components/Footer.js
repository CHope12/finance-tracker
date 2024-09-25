import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { TbHome } from "react-icons/tb";
import { TbCash } from "react-icons/tb";
import { IoAdd } from "react-icons/io5";
import { TbCashOff } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";

const Footer = ({ openModal }) => {

  const pathname = usePathname();

  return (
    <footer className="fixed bg-white border-t-2 bottom-0 left-0 right-0 mx-auto flex justify-center">
      <div className="flex items-center justify-around w-full max-w-2xl py-4">
        {/* Add button */}        
        <button className={`p-0 md:p-4 text-3xl md:text-4xl ${pathname === "/" ? "border-b-4 border-blue-500" : ""}`}>
          <Link href="/">
            <TbHome />
          </Link>
        </button>
        <button className={`p-0 md:p-4 text-3xl md:text-4xl ${pathname == "/incomehistory" ? "border-b-4 border-blue-500" : ""}`}>
        <Link href="/incomehistory">
          <TbCash />
        </Link>
        </button>
        <button className="bg-blue-500 text-white rounded-full p-0 md:p-4 text-4xl md:text-5xl" onClick={openModal}>
          <IoAdd />  
        </button>
        <button className={`p-0 md:p-4 text-3xl md:text-4xl ${pathname === "/expensehistory" ? "border-b-4 border-blue-500" : ""}`}>
          <Link href="/expensehistory">
            <TbCashOff />
          </Link>
        </button>
        <button className={`p-0 md:p-4 text-3xl md:text-4xl ${pathname === "/profile" ? "border-b-4 border-blue-500" : ""}`}>
          <Link href="/profile">
            <CgProfile />
          </Link>
        </button>
      </div>
    </footer>
  );
};

export default Footer;