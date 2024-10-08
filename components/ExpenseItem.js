import React from 'react'

import { IoBagCheckOutline, IoBus } from "react-icons/io5";
//import card, cash, bank icons
import { IoCardOutline } from "react-icons/io5";
import { IoCashOutline } from "react-icons/io5";
import { IoBusinessOutline } from "react-icons/io5";

import convertDate from '../lib/convertDate'

function ExpenseItem({description, amount, icon, date, paymentType, paymentTypeColor, category, color, button}) {
  return (
    <div className="flex items-center justify-between gap-2 md:gap-4 py-2 pl-1">
      <div className="flex gap-2 md:gap-4 justify-center items-center">
        <div 
          className="p-2 md:p-4 rounded-full text-xl md:text-2xl"
          style={{backgroundColor: paymentTypeColor}}
        >      
          {/* Payment type */}
          {paymentType === "Card" && <IoCardOutline title="Card" />}
          {paymentType === "Cash" && <IoCashOutline title="Cash" />}
          {paymentType === "Bank" && <IoBusinessOutline title="Bank" />}
        </div>
        {/* Category */}
        <div 
          className="p-2 md:p-4 rounded-full flex-col"
          style={{backgroundColor: color}}
        >          
          <div className="text-xl md:text-2xl">
            {icon}     
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-md">{description == "" ? "No name" : description}</span>
          <span className="text-gray-400 text-xs md:text-sm">{convertDate(date)}</span>
        </div>
      </div>
      <div className="flex gap-4 justify-center items-center">
        <span className="text-xl font-bold">£{amount}</span>
        {button}
      </div>
    </div>      
  )
}

export default ExpenseItem;
