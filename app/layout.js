import { Inter } from "next/font/google";
import "./globals.css";

import AuthContextProvider from "@/lib/firebase/auth-context";
import Nav from "@/components/Nav";

const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: 'Finance Tracker'  
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <Nav />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
