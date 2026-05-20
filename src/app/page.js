'use client';

import { Button, Spinner } from "@heroui/react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, MapPin, Users, CarFront } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function Home() {
  const [recentCars, setRecentCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentCars = async () => {
      try {
        const { data } = await api.get("/cars/recent");
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
              Drive Your Dreams{" "}
              <span className="text-primary">Today</span>
            </h1>

            <p className="text-xl text-default-600">
              Experience the thrill of the open road with our premium fleet.
              Flexible rentals, transparent pricing, and unforgettable journeys
              await.
            </p>

            <div className="pt-4 flex gap-4">
              <Button
                as={Link}
                href="/explore"
                color="primary"
                size="lg"
                endContent={<ArrowRight className="w-5 h-5" />}
                className="rounded-2xl px-6 font-bold"
              >
                Explore Cars
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Available Cars Section */}
      {/* FEATURED VEHICLES */}
<section className="container mx-auto px-6 py-20">
  {/* SECTION HEADER */}
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-14">
    <div>
      <p className="text-primary font-semibold mb-2">
        Featured Collection
      </p>

      <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
        Featured Vehicles
      </h2>

      <p className="text-default-500 text-lg">
        Discover our most popular recent rentals.
      </p>
    </div>

    <Button
      as={Link}
      href="/explore"
      color="primary"
      variant="flat"
      size="lg"
      className="rounded-2xl px-6 font-bold"
      endContent={<ArrowRight className="w-5 h-5" />}
    >
      View All Cars
    </Button>
  </div>

  {/* LOADING */}
  {isLoading ? (
    <div className="flex flex-col justify-center items-center py-32">
      <Spinner size="lg" color="primary" />

      <p className="mt-4 text-default-500">
        Loading premium cars...
      </p>
    </div>
  ) : recentCars.length === 0 ? (
    <div className="text-center py-32 border border-dashed border-divider rounded-3xl bg-content1">
      <div className="w-20 h-20 rounded-full bg-default-100 flex items-center justify-center mx-auto mb-6">
        <CarFront className="w-10 h-10 text-default-400" />
      </div>

      <h3 className="text-2xl font-bold mb-3">
        No Cars Available
      </h3>

      <p className="text-default-500">
        Check back again later for new arrivals.
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {recentCars.map((car) => (
        <div
          key={car._id}
          className="group relative overflow-hidden rounded-[32px] bg-content1 border border-divider hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
        >
          {/* IMAGE */}
          <div className="relative h-[260px] overflow-hidden">
            <img
              src={car.image || car.imageUrl}
              alt={car.modelName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* PRICE */}
            <div className="absolute top-4 right-4">
              <div className="bg-background/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl">
                <p className="text-xs text-default-500">
                  Starting from
                </p>

                <p className="font-black text-lg">
                  ${car.price}
                  <span className="text-xs font-medium text-default-500">
                    /day
                  </span>
                </p>
              </div>
            </div>

            {/* TYPE */}
            <div className="absolute bottom-4 left-4">
              <div className="bg-primary/80 backdrop-blur-xl text-white border border-white/10 px-4 py-2 rounded-2xl text-sm font-semibold">
                {car.type}
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6">
            {/* TITLE */}
            <div className="mb-4">
              <h3 className="text-2xl font-black mb-2 tracking-tight">
                {car.modelName}
              </h3>

              <p className="text-default-500 line-clamp-2 leading-relaxed">
                {car.description}
              </p>
            </div>

            {/* INFO */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-default-100 px-4 py-2 rounded-2xl">
                <Users className="w-4 h-4 text-primary" />

                <span className="text-sm font-semibold">
                  {car.seats} Seats
                </span>
              </div>

              <div className="flex items-center gap-2 bg-default-100 px-4 py-2 rounded-2xl">
                <CarFront className="w-4 h-4 text-primary" />

                <span className="text-sm font-semibold">
                  Premium
                </span>
              </div>
            </div>

            {/* BUTTON */}
            <Button
              as={Link}
              href={`/explore/${car._id}`}
              color="primary"
              className="w-full h-12 rounded-2xl font-bold text-base shadow-lg shadow-primary/20"
              endContent={<ArrowRight className="w-5 h-5" />}
            >
              View Details
            </Button>
          </div>

          {/* HOVER EFFECT */}
          <div className="absolute inset-0 rounded-[32px] ring-1 ring-primary/0 group-hover:ring-primary/20 transition-all pointer-events-none" />
        </div>
      ))}
    </div>
  )}
</section>

      {/* Why Choose Us */}
      <section className="bg-default-50 py-16 border-y border-divider">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose DriveFleet?
            </h2>

            <p className="text-default-500 max-w-2xl mx-auto">
              We provide a seamless car rental experience built on trust,
              transparency, and top-tier customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>

              <h3 className="text-xl font-bold mb-3">
                Secure & Insured
              </h3>

              <p className="text-default-500">
                Every rental comes with comprehensive insurance and
                24/7 roadside assistance.
              </p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-primary" />
              </div>

              <h3 className="text-xl font-bold mb-3">
                Flexible Booking
              </h3>

              <p className="text-default-500">
                Book for a day, a week, or a month. Modify or cancel
                reservations easily.
              </p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-primary" />
              </div>

              <h3 className="text-xl font-bold mb-3">
                Convenient Pickups
              </h3>

              <p className="text-default-500">
                Multiple pickup locations across the city, including
                airport delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            What Our Customers Say
          </h2>

          <p className="text-default-500 max-w-2xl mx-auto">
            Thousands of happy drivers trust DriveFleet for their journey.
            Here's what they have to say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah Johnson",
              role: "Business Traveler",
              avatar: "SJ",
              rating: 5,
              review:
                "DriveFleet made my business trip seamless. The car was immaculate, pickup was effortless, and the pricing was completely transparent. Will definitely book again!",
            },
            {
              name: "Marcus Williams",
              role: "Weekend Explorer",
              avatar: "MW",
              rating: 5,
              review:
                "Rented an SUV for a weekend road trip and it was perfect. The booking process took less than 2 minutes and the car exceeded my expectations.",
            },
            {
              name: "Priya Patel",
              role: "Family Vacationer",
              avatar: "PP",
              rating: 5,
              review:
                "Best car rental experience I've had. The family van was spotless, car seats were available, and customer support was incredibly responsive.",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-content1 border border-divider rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-default-600 text-sm leading-relaxed flex-1">
                "{testimonial.review}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-divider">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {testimonial.avatar}
                </div>

                <div>
                  <p className="font-semibold text-sm">
                    {testimonial.name}
                  </p>

                  <p className="text-default-400 text-xs">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}