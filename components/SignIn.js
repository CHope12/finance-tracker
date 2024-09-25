import React, { useContext, useEffect } from "react";

import { authContext } from "@/lib/firebase/auth-context";

import { FcGoogle } from "react-icons/fc";

function SignIn() {
  
  const { googleLoginHandler } = useContext(authContext);

  return (
    <main className="container w-full h-[90svh] flex justify-center items-center overflow-hidden">          
        <div className="w-full h-full flex flex-col justify-center items-center overflow-hidden">
          <h3 className="text-2xl text-center">Please sign in to continue</h3>

          <button
            onClick={googleLoginHandler}
            className="flex self-start gap-2 p-4 mx-auto mt-6 font-medium text-white align-middle bg-gray-700 rounded-lg"
          >
            <FcGoogle className="text-2xl" /> Google
          </button>
        </div>
    </main>
  );
}

export default SignIn;