import React from 'react'

import { IoBagCheckOutline } from "react-icons/io5";

function ExpenseCategoryItem({color, title, amount, icon, percentage}) {
  return (
    <div className="flex items-center gap-2 px-6 my-6">
      <div className="p-2 rounded-full" style={{backgroundColor: color}}>
        <IoBagCheckOutline className="text-2xl" />
      </div>
      <div className="flex justify-between w-full items-center">
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="flex flex-col text-right">
        <span className="font-bold text-large"><span className="text-gray-400 text-sm">£</span>{amount}</span>
        <span className="text-gray-400 text-sm">{percentage}</span>
        </div>
      </div>
    </div>
  )
}

export default ExpenseCategoryItem