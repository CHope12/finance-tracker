"use client";
import { useState, useRef, useEffect, useContext } from 'react';

import Link from 'next/link';

import { authContext } from '@/lib/firebase/auth-context';

import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Modal from '@/components/Modal';
import SignIn from "@/components/SignIn"
import ExpenseCategoryItem from '@/components/ExpenseCategoryItem';
import IncomeItem from '@/components/IncomeItem';
import ExpenseItem from '@/components/ExpenseItem';

import sortByDate from "./../lib/sortByDate";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);

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
    icon: <IoHome title="Housing" />,
  },
  {
    title: "Transportation",
    color: "#36A2EB",
    icon: <IoCar title="Transportation" />,
  },
  {
    title: "Food",
    color: "#FFCE56",
    icon: <LuUtensils title="Food" />,
  },
  {
    title: "Healthcare",
    color: "#4BC0C0",
    icon: <FaRegHospital title="Healthcare" />,
  },
  {
    title: "Entertainment",
    color: "#FF9F40",
    icon: <IoFilm title="Entertainment" />,
  },
  {
    title: "Shopping",
    color: "#FFCD56",
    icon: <FiShoppingCart title="Shopping" />,
  },
  {
    title: "Education",
    color: "#FF6384",
    icon: <IoBook title="Education" />,
  },
  {
    title: "Personal Care",
    color: "#36A2EB",
    icon: <IoCut title="Personal Care" />,
  },
  {
    title: "Travel",
    color: "#FFCE56",
    icon: <IoAirplane title="Travel" />,
  },
  {
    title: "Miscellaneous",
    color: "#4BC0C0",
    icon: <IoEllipsisHorizontal title="Miscellaneous" />,
  },
  {
    title: "Savings & Investments",
    color: "#FF9F40",
    icon: <PiPiggyBank title="Savings & Investments" />,
  },
  {
    title: "Utilities",
    color: "#FFCD56",
    icon: <HiOutlineBolt title="Utilities" />,
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

    const [incomeHistory, setIncomeHistory] = useState([]);
    const [expenseHistory, setExpenseHistory] = useState([]);

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const closeModal = () => {
      setModalIsOpen(false);
    }    
    
    /* Income & Expenses */
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
      
      //update income
      const getIncomeData = async () => {                
        const collectionRef = collection(db, "income");

        const q = query(collectionRef, where("uid", "==", user.uid));

        const docsSnap = await getDocs(q);
        const data = docsSnap.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
            date: new Date(doc.data().date.toMillis()),
          };
        })
        let income = sortByDate(data);
        setIncomeHistory(income);
      };
      getIncomeData();

      //update expeneses
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
        let expense = sortByDate(data);
        setExpenseHistory(expense);
      };
      getExpenseData();

    }, [user]);

    /* Summary */    
    const getWeekNumber = (date) => {
      // Copy date so don't modify original
      date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

      // Set to nearest Thursday: current date + 3 - current day number
      date.setUTCDate(date.getUTCDate() + 3 - (date.getUTCDay() + 6) % 7);

      // Get first day of year
      const week1 = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));

      // Calculate full weeks to nearest Thursday
      return 1 + Math.round(((date - week1) / 86400000 - 3 + ((week1.getUTCDay() + 6) % 7)) / 7);
    };    

  if (!user && !loading) {
    return <SignIn />;
  }

  return (
    <>
    <main>    
    {user && (
      <Modal open={modalIsOpen} close={closeModal} user={user} updateIncome={setIncomeHistory} updateExpenses={setExpenseHistory} categories={categories} paymentTypes={paymentTypes}/>
    )}

    {/* Summary */}    
    <section className="py-4">

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">Summary</h2>
          <h3 className="text-lg">Balance and income</h3>
          <div className="flex justify-around">
            {/* Total balance */}
            <div className="flex flex-col justify-center items-center">
              <p className="text-gray-400">Your total balance is</p>          
              <div>
              {incomeHistory.reduce((total, income) => total + parseFloat(income.amount), 0) - expenseHistory.reduce((total, expense) => total + parseFloat(expense.amount), 0) > 0 ? (
                <span className="text-3xl font-bold text-green-500">£{incomeHistory.reduce((total, income) => total + parseFloat(income.amount), 0) - expenseHistory.reduce((total, expense) => total + parseFloat(expense.amount), 0)}</span>
              ) : (
                <span className="text-3xl font-bold text-red-500">£{incomeHistory.reduce((total, income) => total + parseFloat(income.amount), 0) - expenseHistory.reduce((total, expense) => total + parseFloat(expense.amount), 0)}</span>
              )}
              </div>
            </div>
            {/* Total Income */}
            <div className="flex flex-col justify-center items-center">
              <p className="text-gray-400">Your total income is</p>
              <span className="text-3xl font-bold text-green-500">£{incomeHistory.reduce((total, income) => total + parseFloat(income.amount), 0)}</span>
            </div>            
          </div>

          <h3 className="text-lg">Expenses</h3>
          {/* Total Expense */}
          <div className="flex justify-left">
            <div className="flex flex-col w-1/2 items-center justify-center">
              <span className="text-gray-400">Your total expenses are</span>
              <span className="text-3xl font-bold text-red-500">£{expenseHistory.reduce((total, expense) => total + parseFloat(expense.amount), 0)}</span>          
            </div>          
          </div>
        </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
        <div className="bg-gray-100 p-4 rounded-full flex-col w-full text-center">
          {/* Daily Expenses */}
          <h3 className="text-gray-400">Daily expenses</h3>
          <span className="text-xl font-bold">
            £{expenseHistory.filter(expense => new Date(expense.date).getDate() === new Date().getDate()).reduce((total, expense) => total + parseFloat(expense.amount), 0)}
          </span>
        </div>
        <div className="bg-gray-100 p-4 rounded-full flex-col w-full text-center">
          {/* Weekly Expenses */}
          <h3 className="text-gray-400">Weekly expenses</h3>
          <span className="text-xl font-bold">
            £{expenseHistory.filter(expense => getWeekNumber(new Date(expense.date)) === getWeekNumber(new Date())).reduce((total, expense) => total + parseFloat(expense.amount), 0)}
          </span>
        </div>
        <div className="bg-gray-100 p-4 rounded-full flex-col w-full text-center">
          {/* Monthly Expenses */}
          <h3 className="text-gray-400">Monthly expenses</h3>
          <span className="text-xl font-bold">
            £{expenseHistory.filter(expense => new Date(expense.date).getMonth() === new Date().getMonth()).reduce((total, expense) => total + parseFloat(expense.amount), 0)}
          </span>
        </div>
      </div>
    </section>

    {/* expenses by categories */}       
    <section className="py-4">
      <h2 className="text-xl font-bold">Expenses By Categories</h2>
      {categories.map((category) => {
        const categoryAmount = expenseHistory.reduce((total, expense) => {
          return expense.category === category.title ? total + parseFloat(expense.amount) : total;
        }, 0).toFixed(2);
        if (categoryAmount > 0) {
          return (
            <ExpenseCategoryItem
              key={category.title}
              title={category.title}
              amount={categoryAmount}
              icon={category.icon}
              color={category.color}
              percentage={
                ((categoryAmount / expenseHistory.reduce((total, expense) => total + parseFloat(expense.amount), 0)) * 100).toFixed(2) + "%"
              }
            />
          );
        }
      })}
    </section>
    

    {/* Income History */}
    <section className="py-4">
      <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold">Income History</h3>
      <Link href="/incomehistory"><button className="bg-blue-500 rounded-lg px-2 py-1 text-white">View All</button></Link>
      </div>

      {incomeHistory.length > 3 ? (incomeHistory.slice(0, 3).map((i) => (
        <IncomeItem
          key={i.id}
          title={i.description}
          amount={i.amount}
          date={i.date}
          button={
          <button title="Delete" className="bg-red-500 text-white rounded-full p-2" onClick={() => { deleteIncomeEntryHandler(i.id)}}>
            <IoTrashOutline />
          </button>
        }
        />
      ))) : (incomeHistory.map((i) => (
        <IncomeItem
          key={i.id}
          title={i.description}
          amount={i.amount}
          date={i.date}
          button={
          <button title="Delete" className="bg-red-500 text-white rounded-full p-2" onClick={() => { deleteIncomeEntryHandler(i.id)}}>
            <IoTrashOutline />
          </button>
        }
        />
      )))}

    </section>

    {/* Expense History */}
    <section className="py-4">
      <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold">Expense History</h3>
      <Link href="/expensehistory"><button className="bg-blue-500 rounded-lg px-2 py-1 text-white">View All</button></Link>
      </div>

      {expenseHistory.length > 3 ? (expenseHistory.slice(0, 3).map((expense) => (
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
            <button title="Delete" className="bg-red-500 text-white rounded-full p-2" onClick={() => { deleteExpenseEntryHandler(expense.id)}}>
              <IoTrashOutline />
            </button>
          }
        />
      ))) : (expenseHistory.map((expense) => (
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
            <button title="Delete" className="bg-red-500 text-white rounded-full p-2" onClick={() => { deleteExpenseEntryHandler(expense.id)}}>
              <IoTrashOutline />
            </button>
          }
        />
      )))}
    </section>

    {/* Chart */}
    <section className="pt-6 pb-24 md:pb-48">
      <h3 className="text-xl font-bold">Stats</h3>
      <div className="w-full h-[250px] md:w-1/2 md:h-auto md:mx-auto flex justify-center items-center">
        <Doughnut data={{
          labels: expenseHistory.map(expense => expense.category),
          datasets: [
            {
              label: "Expenses",
              data: expenseHistory.map(expense => expense.amount),
              backgroundColor: expenseHistory.map(expense => expense.color),
              borderColor: ['#fff'],
              borderWidth: 5,
            }
          ]
        }} />
      </div>
    </section>

    </main>

    {/* Bottom Nav */}
    <Footer openModal={() => setModalIsOpen(true)}/>

    </>
  );
}
