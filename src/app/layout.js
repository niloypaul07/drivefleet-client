import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import LayoutContent from "@/components/LayoutContent";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DriveFleet - Premium Car Rental",
  description: "Explore, book, and manage premium car rentals with DriveFleet.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <Providers>
          <LayoutContent>
            {children}
          </LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
