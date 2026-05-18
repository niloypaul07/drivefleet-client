'use client';

import { Button, Link, Spinner } from "@heroui/react";
import { ArrowRight, ShieldCheck, Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function Home() {
  const [recentCars, setRecentCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentCars = async () => {
      try {
        const { data } = await api.get('/cars/recent');
        setRecentCars(data);
      } catch (error) {
        console.error("Failed to fetch recent cars", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecentCars();
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Banner Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=2928&auto=format&fit=crop" 
            alt="Luxury Car Banner" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              Drive Your Dreams <span className="text-primary">Today</span>
            </h1>
            <p className="text-xl text-default-600">
              Experience the thrill of the open road with our premium fleet. Flexible rentals, transparent pricing, and unforgettable journeys await.
            </p>
            <div className="pt-4 flex gap-4">
              <Button as={Link} href="/explore" color="primary" size="lg" endContent={<ArrowRight className="w-5 h-5" />}>
                Explore Cars
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Available Cars Section */}
      <section className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Vehicles</h2>
            <p className="text-default-500">Discover our most popular recent rentals.</p>
          </div>
          <Button variant="light" color="primary" endContent={<ArrowRight className="w-4 h-4" />} as={Link} href="/explore">
            View All
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20"><Spinner size="lg" /></div>
        ) : recentCars.length === 0 ? (
          <p className="text-default-500 text-center py-10">No cars available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCars.map((car) => (
              <div key={car._id} className="bg-content1 border border-divider rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="aspect-[16/9] bg-default-200 relative">
                  <img 
                    src={car.image} 
                    alt={car.modelName} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold">
                    ${car.price} / day
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{car.modelName}</h3>
                  <div className="flex justify-between items-center text-sm text-default-500 mb-6">
                    <span className="bg-default-100 px-2 py-1 rounded">{car.type}</span>
                    <span className="bg-default-100 px-2 py-1 rounded">{car.seats} Seats</span>
                  </div>
                  <Button color="primary" variant="flat" className="w-full" as={Link} href={`/explore/${car._id}`}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-default-50 py-16 border-y border-divider">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose DriveFleet?</h2>
            <p className="text-default-500 max-w-2xl mx-auto">We provide a seamless car rental experience built on trust, transparency, and top-tier customer service.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Insured</h3>
              <p className="text-default-500">Every rental comes with comprehensive insurance and 24/7 roadside assistance.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Booking</h3>
              <p className="text-default-500">Book for a day, a week, or a month. Modify or cancel reservations easily.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Convenient Pickups</h3>
              <p className="text-default-500">Multiple pickup locations across the city, including airport delivery.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
