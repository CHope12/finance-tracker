import React from 'react'

function IncomeItem({title, amount, date, button}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 pl-2">
      <div className="flex gap-8">
        <div className="flex flex-col">
          <span className="text-md">{title == "" ? "No name" : title}</span>
          <span className="text-gray-400 text-sm">{date.toISOString()}</span>
        </div>
      </div>
      <div className="flex gap-4 justify-center items-center">
        <span className="text-xl font-bold">£{amount}</span>
        {button}
      </div>
    </div>      
  )
}

export default IncomeItem;
