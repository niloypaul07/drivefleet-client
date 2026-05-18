import { Link } from "@heroui/react";
import { CarFront, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-default-50 border-t border-divider pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <CarFront className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl tracking-tight">DriveFleet</span>
            </div>
            <p className="text-default-500 mb-6">
              Experience the best car rental service with our premium fleet. Your journey, our priority.
            </p>
            <div className="flex gap-4">
              <Link href="#" color="foreground" className="hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" color="foreground" className="hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" color="foreground" className="hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
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
