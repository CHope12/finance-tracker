"use client";
import React, { useContext } from 'react';

import Link from "next/link";

import { authContext } from '@/lib/firebase/auth-context';

import { IoNotificationsOutline } from "react-icons/io5";
import { PiPaintBrushBroad } from "react-icons/pi";
import { IoLogOutOutline } from "react-icons/io5";

const Nav = () => {

  const { user, loading, logout } = useContext(authContext);

  if (!user){
    return;
  }

  return (    
    <header className="flex items-center justify-between">         

      {/* Profile section */}
      {!loading && (
        <div className="flex items-center gap-2">
          <Link href="/profile">
            <div className="h-[40px] w-[40px] rounded-full overflow-hidden">
              <img
                src={user.photoURL}
                alt="Profile picture"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          <span className="text-md">Hi {user.displayName}!</span>
        </div>
      )}

      {/* Button section */}
      <nav className="flex items-center gap-2">
        {/*
        <div className="rounded-full bg-slate-100 p-2">
          <PiPaintBrushBroad className="text-2xl" />
        </div>
        */}
        <div className="rounded-full bg-slate-100 p-2 cursor-pointer" onClick={logout}>
          <IoLogOutOutline className="text-2xl" />
        </div>
      </nav>

    </header>
  )
}

export default Nav


