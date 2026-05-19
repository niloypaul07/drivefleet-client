'use client';

import { usePathname } from "next/navigation";
import AppNavbar from "./AppNavbar";
import Footer from "./Footer";

export default function LayoutContent({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!hideLayout && <AppNavbar />}
      <main className={`flex-grow w-full ${!hideLayout ? "pt-2 sm:pt-4" : ""}`}>
        {children}
      </main>
      {!hideLayout && <Footer />}
    </>
  );
}