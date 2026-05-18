'use client';

import { usePathname } from "next/navigation";
import AppNavbar from "./AppNavbar";
import Footer from "./Footer";

export default function LayoutContent({ children }) {
  const pathname = usePathname();
  
  // Hide navbar and footer on /login and /register routes
  const hideLayout = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!hideLayout && <AppNavbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!hideLayout && <Footer />}
    </>
  );
}
