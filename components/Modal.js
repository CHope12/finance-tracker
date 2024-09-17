import React, { useState, useRef, useEffect } from "react";

//Firebase
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, getFirestore, doc, deleteDoc, query, where } from 'firebase/firestore';

import { IoCalendarClearOutline } from "react-icons/io5";
import { IoCheckmarkSharp } from "react-icons/io5";
import { IoBackspaceOutline } from "react-icons/io5";

const modal = ({ open, close, user, updateIncome, updateExpenses, categories, paymentTypes }) => {

  const [modalIsIncome, setModalIsIncome] = useState(true);

  /* Number input */
  const [amountInput, setAmountInput] = useState("0");
  const formatAmount = (value) => {
    // Remove non-numeric characters except decimal point
    let formattedValue = value.replace(/[^0-9.]/g, '');
    
    // Split into integer and decimal parts
    const [integerPart, decimalPart] = formattedValue.split('.');
    
    // Limit decimal places to 2
    const newDecimalPart = decimalPart ? decimalPart.slice(0, 2) : '';
    formattedValue = `${integerPart}${newDecimalPart ? '.' + newDecimalPart : ''}`;

    return formattedValue;
  };

  const handleButtonClick = (value) => {
    setAmountInput(prev => {
      const newValue = prev === "0" ? value : prev + value;
      return formatAmount(newValue);
    });
  };

  const handleBackspace = () => {
    setAmountInput(prev => prev.slice(0, -1) || "0");
  };

  const handleDecimal = () => {
    if (!amountInput.includes(".")) {
      setAmountInput(prev => prev + ".");
    }
  };
  

  /* Date input */
  const handleDate = () => {
    // Implement date logic here
  };

  /* Form submission */
  const descriptionRef = useRef();
  const paymentTypeRef = useRef();
  const categoryRef = useRef();

  // category    
  const handleCategoryChange = (e) => {
    e.preventDefault;      
    const category = categories.find(category => category.title === e.target.value);            
    categoryRef.current.style.backgroundColor = category.color;
  };

  //payment type
  const handlePaymentTypeChange = (e) => {
    e.preventDefault;
    const paymentType = paymentTypes.find(paymentType => paymentType.title === e.target.value);
    paymentTypeRef.current.style.backgroundColor = paymentType.color;
  }


  const handleSubmit = (e) => {
    if (amountInput === "0") {
      return;
    }
    e.preventDefault();
    if (modalIsIncome) {
      addIncomeHandler(e);
    } else {
      addExpenseHandler(e);
    }
    close();
    setAmountInput("0");
    descriptionRef.current.value = "";
  }

  /* Income */
  const addIncomeHandler = async (e) => {
    e.preventDefault();

    const newIncome = {
      amount: amountInput,
      description: descriptionRef.current.value,
      date: new Date(),
      uid: user.uid,
    }

    const collectionRef = collection(db, "income");
    try {
    const docSnap = await addDoc(collectionRef, newIncome);

    updateIncome(prevState => {
      return[
        ...prevState,
        {
          id: docSnap.id,
          ...newIncome,
        },
      ];
    });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  
  const deleteIncomeEntryHandler = async (id) => {
    const docRef = doc(db, "income", id);
    try {
      await deleteDoc(docRef);

      //Update state
      setIncomeHistory(prevState => {
        return prevState.filter(income => income.id !== id);
      });
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }

  /* Expense */
  const addExpenseHandler = (e) => {
    e.preventDefault();

    const newExpense = {
      amount: amountInput,
      description: descriptionRef.current.value,
      paymentType: paymentTypeRef.current.value,
      category: categoryRef.current.value,
      color: categories.find(category => category.title === categoryRef.current.value).color,
      date: new Date(),
      uid: user.uid,
    }

    const collectionRef = collection(db, "expenses");
    try {
    const docSnap = addDoc(collectionRef, newExpense);

    updateExpenses(prevState => {
      return[
        ...prevState,
        {
          id: docSnap.id,
          uid: user.uid,
          ...newExpense,
        },
      ];        
    });
    } catch (e) {
      console.error("Error adding document: ", e);
    }      
  };

  const deleteExpenseEntryHandler = async (id) => {
    const docRef = doc(db, "expenses", id);
    try {
      await deleteDoc(docRef);

      //Update state
      setExpenseHistory(prevState => {
        return prevState.filter(expense => expense.id !== id);
      });
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  return (
    <div 
    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-end justify-center z-[2] transition-transform duration-300 ease-in-out overflow-hidden"
    style={{
      transform: open ? "translateY(0)" : "translateY(100%)",
    }}
   >
    <div className="bg-white p-8 rounded-3xl mx-4 mb-4">
      
      <div className="w-1/4 h-2 bg-gray-300 rounded-full mx-auto" onClick={() => close()}></div>
      
      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 justify-center items-center">

        {!modalIsIncome && (
          <div className="flex gap-4 w-full h-[50px] mt-2">
            {/* payment type */}
            <select className="p-2 rounded-full w-full" ref={paymentTypeRef} onChange={handlePaymentTypeChange} style={{backgroundColor: paymentTypes[0].color}}>
              <option>Cash</option>
              <option>Card</option>
              <option>Bank</option>
            </select>
            {/* category */ }
            <select className="p-2 rounded-full w-full" ref={categoryRef} onChange={handleCategoryChange} style={{backgroundColor: categories[0].color}}>
              {categories.map(category => (
                <option key={category.title}>{category.title}</option>
              ))}
            </select>
          </div>
          )}

          {/* income/expense toggle */}
          <div className="button r w-full h-[50px]" id="button-1">          
            <div className="absolute w-full flex justify-around text-2xl font-bold text-black leading-[45px]">
              <div>Income</div>
              <div>Expense</div>
            </div>
            <input type="checkbox" className="checkbox" onClick={() => setModalIsIncome(!modalIsIncome)}/>
              <div className="knobs"></div>
            <div className="layer"></div>          
          </div>
        
          {/* amount */}
          <div className="flex justify-center items-end w-1/2 my-3">
            <span className="text-gray-400 text-5xl mb-1">£</span>
            <span className="text-7xl">{amountInput}</span>              
          </div>

          {/* description */}
          <input ref={descriptionRef} type="text" placeholder="Add description..." className="p-2 rounded-lg text-center text-2xl" />

          {/* add number input buttons like a calculator */}
          <div className="grid grid-cols-4 gap-2 w-full h-[575px]">
                <button type="button" className="bg-gray-100 p-2 rounded-3xl" onClick={() => handleButtonClick("1")}>1</button>
                <button type="button" className="bg-gray-100 p-2 rounded-3xl" onClick={() => handleButtonClick("2")}>2</button>
                <button type="button" className="bg-gray-100 p-2 rounded-3xl" onClick={() => handleButtonClick("3")}>3</button>
                <button type="button" className="bg-red-500 text-white p-2 rounded-3xl flex justify-center items-center" onClick={handleBackspace}>
                  <IoBackspaceOutline className="w-1/3 h-1/3" />
                </button>
                <button type="button" className="bg-gray-100 p-2 rounded-3xl" onClick={() => handleButtonClick("4")}>4</button>
                <button type="button" className="bg-gray-100 p-2 rounded-3xl" onClick={() => handleButtonClick("5")}>5</button>
                <button type="button" className="bg-gray-100 p-2 rounded-3xl" onClick={() => handleButtonClick("6")}>6</button>
                <button type="button" className="bg-gray-500 text-white p-2 rounded-3xl flex justify-center items-center" onClick={handleDate}>
                  <IoCalendarClearOutline className="w-1/3 h-1/3" />
                </button>
                <button type="button" className="bg-gray-100 p-2 rounded-3xl" onClick={() => handleButtonClick("7")}>7</button>
                <button type="button" className="bg-gray-100 p-2 rounded-3xl" onClick={() => handleButtonClick("8")}>8</button>
                <button type="button" className="bg-gray-100 p-2 rounded-3xl" onClick={() => handleButtonClick("9")}>9</button>
                <button type="button" className="bg-blue-500 text-white p-2 rounded-3xl h-[200%] flex justify-center items-center" onClick={handleSubmit}>
                  <IoCheckmarkSharp className="w-1/3 h-1/3" />
                </button>
                <button type="button" className="pointer-events-none p-2"></button>
                <button type="button" className="bg-gray-100 p-2 rounded-3xl" onClick={() => handleButtonClick("0")}>0</button>
                <button type="button" className="bg-gray-100 p-2 rounded-3xl" onClick={handleDecimal}>.</button>
              </div>           

        </div>
      </form>
    </div>
  </div>  
  );
};

export default modal;