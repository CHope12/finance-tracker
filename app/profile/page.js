"use client";
import React, { useState, useContext } from 'react';

import { authContext } from '@/lib/firebase/auth-context';

import Nav from '@/components/Nav';
import Footer from "@/components/Footer";
import SignIn from "@/components/SignIn"

import { IoWarningOutline } from "react-icons/io5";


import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, getFirestore, doc, deleteDoc, query, where } from 'firebase/firestore';

export default function Home() {

  const { user, loading } = useContext(authContext);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  if(!user){
    return(
      <SignIn />
    )
  }

  const deleteData = async () => {    
    try {
      // Delete expenses
      const expensesQuery = query(collection(db, "expenses"), where("uid", "==", user.uid));
      const expensesSnapshot = await getDocs(expensesQuery);
      const expensesDeletions = expensesSnapshot.docs.map((doc) => deleteDoc(doc.ref));
  
      // Delete income
      const incomeQuery = query(collection(db, "income"), where("uid", "==", user.uid));
      const incomeSnapshot = await getDocs(incomeQuery);
      const incomeDeletions = incomeSnapshot.docs.map((doc) => deleteDoc(doc.ref));
  
      // Execute all deletions
      await Promise.all([...expensesDeletions, ...incomeDeletions]);
  
      console.log("Data successfully deleted.");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  return (
    <>    
    <main className="py-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Profile</h3>
      </div>
      <div className="flex flex-col gap-4">
        <span>Name: {user.displayName}</span>
        <span>Email: {user.email}</span>
        <span>Verified: {user.emailVerified == true ? "✅" : "❌"}</span>
        <button className="bg-red-500 p-4 md:w-1/3 text-white font-bold">
          <span className="flex justify-center items-center gap-2" onClick={deleteData}>Delete data <IoWarningOutline className="text-2xl"/></span>
        </button>
      </div>
    </main>    
    <Footer openModal={() => setModalIsOpen(true)}/>
    </>
  );
}