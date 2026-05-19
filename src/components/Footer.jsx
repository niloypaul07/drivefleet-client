"use client";

import { Link } from "@heroui/react";
import { CarFront, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-default-50 border-t border-divider pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <CarFront className="w-8 h-8 text-primary" />
              <div className="flex flex-col leading-none">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-foreground">
                Drive
              </span>

              <span className="font-extrabold text-base sm:text-lg tracking-tight text-primary -mt-1">
                Fleet
              </span>
            </div>
            </div>
            <p className="text-default-500 mb-6">
              Experience the best car rental service with our premium fleet. Your journey, our priority.
            </p>
            <div className="flex gap-4">
              <Link href="#" color="foreground" className="hover:text-primary transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </Link>
              <Link href="#" color="foreground" className="hover:text-primary transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </Link>
              <Link href="#" color="foreground" className="hover:text-primary transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Useful Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" color="foreground" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/explore" color="foreground" className="hover:text-primary transition-colors">Explore Cars</Link></li>
              <li><Link href="/about" color="foreground" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/terms" color="foreground" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Top Categories</h4>
            <ul className="space-y-3">
              <li><Link href="/explore?type=SUV" color="foreground" className="hover:text-primary transition-colors">SUVs</Link></li>
              <li><Link href="/explore?type=Sedan" color="foreground" className="hover:text-primary transition-colors">Sedans</Link></li>
              <li><Link href="/explore?type=Luxury" color="foreground" className="hover:text-primary transition-colors">Luxury</Link></li>
              <li><Link href="/explore?type=Electric" color="foreground" className="hover:text-primary transition-colors">Electric</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-default-500">
                <MapPin className="w-5 h-5 shrink-0 text-primary" />
                <span>123 Drive Street, Auto City, AC 12345</span>
              </li>
              <li className="flex items-center gap-3 text-default-500">
                <Phone className="w-5 h-5 shrink-0 text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-default-500">
                <Mail className="w-5 h-5 shrink-0 text-primary" />
                <span>support@drivefleet.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-divider pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-default-500 text-sm">
            &copy; {new Date().getFullYear()} DriveFleet. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <Link href="/privacy" color="foreground" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/cookies" color="foreground" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
