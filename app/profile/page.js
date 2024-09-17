"use client";
import React, { useState, useContext } from 'react';

import { authContext } from '@/lib/firebase/auth-context';

import Nav from '@/components/Nav';
import Footer from "@/components/Footer";
import SignIn from "@/components/SignIn"

import { IoWarningOutline } from "react-icons/io5";

export default function Home() {

  const { user, loading } = useContext(authContext);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  if(!user){
    return(
      <SignIn />
    )
  }

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
        <button className="bg-red-500 p-4 w-1/3 text-white font-bold">
          <span className="flex justify-center items-center gap-2">Delete data <IoWarningOutline className="text-2xl"/></span>
        </button>
      </div>
    </main>    
    <Footer openModal={() => setModalIsOpen(true)}/>
    </>
  );
}