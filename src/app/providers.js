'use client';

import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }) {
  return (
    <HeroUIProvider>
      <Toaster position="bottom-right" />
      {children}
    </HeroUIProvider>
  );
}
