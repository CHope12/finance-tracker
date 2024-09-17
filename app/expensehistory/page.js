"use client";
import React, { useEffect, useState, useContext } from 'react';

import { authContext } from '@/lib/firebase/auth-context';

import Modal from "@/components/Modal"
import Footer from "@/components/Footer";
import SignIn from "@/components/SignIn";
import ExpenseItem from "@/components/ExpenseItem";

//Firebase
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, getFirestore, doc, deleteDoc, query, where } from 'firebase/firestore';

// Icons
import { IoTrashOutline } from "react-icons/io5";

import { IoHome } from 'react-icons/io5';
import { IoCar } from 'react-icons/io5';
import { LuUtensils } from "react-icons/lu";
import { FaRegHospital } from "react-icons/fa";
import { IoFilm } from 'react-icons/io5';
import { FiShoppingCart } from "react-icons/fi";
import { IoBook } from 'react-icons/io5';
import { IoCut } from 'react-icons/io5';
import { IoAirplane } from 'react-icons/io5';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { PiPiggyBank } from "react-icons/pi";
import { HiOutlineBolt } from "react-icons/hi2";

import { HiOutlineCash } from "react-icons/hi";
import { IoCardOutline } from "react-icons/io5";
import { IoBusinessOutline } from "react-icons/io5";

const categories = [
  {
    title: "Housing",
    color: "#FF6384",
    icon: <IoHome />,
  },
  {
    title: "Transportation",
    color: "#36A2EB",
    icon: <IoCar />,
  },
  {
    title: "Food",
    color: "#FFCE56",
    icon: <LuUtensils />,
  },
  {
    title: "Healthcare",
    color: "#4BC0C0",
    icon: <FaRegHospital />,
  },
  {
    title: "Entertainment",
    color: "#FF9F40",
    icon: <IoFilm />,
  },
  {
    title: "Shopping",
    color: "#FFCD56",
    icon: <FiShoppingCart/>,
  },
  {
    title: "Education",
    color: "#FF6384",
    icon: <IoBook />,
  },
  {
    title: "Personal Care",
    color: "#36A2EB",
    icon: <IoCut />,
  },
  {
    title: "Travel",
    color: "#FFCE56",
    icon: <IoAirplane />,
  },
  {
    title: "Miscellaneous",
    color: "#4BC0C0",
    icon: <IoEllipsisHorizontal />,
  },
  {
    title: "Savings & Investments",
    color: "#FF9F40",
    icon: <PiPiggyBank />,
  },
  {
    title: "Utilities",
    color: "#FFCD56",
    icon: <HiOutlineBolt />,
  }
];

const paymentTypes = [
  {
    title: "Cash",
    color: "#FF6384",
    icon: <HiOutlineCash />,
  },
  {
    title: "Card",
    color: "#36A2EB",
    icon: <IoCardOutline />,
  },
  {
    title: "Bank",
    color: "#FFCE56",
    icon: <IoBusinessOutline />,
  },
]

export default function Home() {
  
  const { user, loading } = useContext(authContext);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const closeModal = () => {
    setModalIsOpen(false);
  }    
  
  const [expenseHistory, setExpenseHistory] = useState([]);
  
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

  useEffect(() => {      
    if(!user){
      return;
    }
    
    //update expenses
    const getExpenseData = async () => {
      const collectionRef = collection(db, "expenses");

      const q = query(collectionRef, where("uid", "==", user.uid));

      const docsSnap = await getDocs(q);
      const data = docsSnap.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
          date: new Date(doc.data().date.toMillis()),
        };
      })
      setExpenseHistory(data);    
    };
    getExpenseData();
  }, [user]);


  if (!user && !loading) {
    return (
      <SignIn />
    )
  }

  return (
    <>
    <Modal open={modalIsOpen} close={closeModal} user={user} updateExpenses={setExpenseHistory} categories={categories} paymentTypes={paymentTypes}/>
    {/* Income History */}
    <main className="py-6">
      <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold">Expense History</h3>
      </div>
      {expenseHistory.map((expense) => (
        <ExpenseItem
          key={expense.id}
          description={expense.description}
          amount={expense.amount}
          paymentType = {expense.paymentType}
          category = {expense.category}
          color = {expense.color}
          paymentTypeColor = {paymentTypes.find(paymentType => paymentType.title === expense.paymentType).color}
          date={expense.date}
          icon={categories.find(category => category.title === expense.category).icon}
          button={
            <button className="bg-red-500 text-white rounded-full p-2" onClick={() => { deleteExpenseEntryHandler(expense.id)}}>
              <IoTrashOutline />
            </button>
          }
        />
      ))}
    </main>
    <Footer openModal={() => setModalIsOpen(true)}/>
    </>
  );
}