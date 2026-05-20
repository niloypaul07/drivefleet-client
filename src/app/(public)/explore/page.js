'use client';

import {
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
  Chip,
} from "@heroui/react";

import {
  Search,
  ArrowRight,
  CarFront,
  Users,
  Sparkles,
} from "lucide-react";

import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

export default function ExploreCars() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [carType, setCarType] = useState("All");

  const fetchCars = async () => {
    setIsLoading(true);

    try {
      const { data } = await api.get("/cars", {
        params: {
          search: searchQuery,
          type: carType !== "All" ? carType : undefined,
        },
      });

      setCars(data);
    } catch (error) {
      console.error("Failed to fetch cars", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCars();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, carType]);

  return (
    <div className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-divider">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/10 blur-3xl rounded-full" />

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl">
            <Chip
              startContent={<Sparkles className="w-3.5 h-3.5" />}
              variant="flat"
              color="primary"
              className="mb-6 px-4 py-5 rounded-full"
            >
              Premium Rental Experience
            </Chip>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
              Explore Your
              <span className="block text-primary">
                Dream Ride
              </span>
            </h1>

            <p className="text-lg md:text-xl text-default-500 max-w-2xl leading-relaxed">
              Discover premium vehicles designed for luxury,
              comfort, and unforgettable journeys.
            </p>

            {/* SEARCH BAR */}
            <div className="mt-10 bg-content1/80 backdrop-blur-2xl border border-divider rounded-3xl p-4 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Input
                  size="lg"
                  placeholder="Search your dream car..."
                  startContent={
                    <Search className="w-5 h-5 text-default-400" />
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  classNames={{
                    inputWrapper:
                      "bg-default-100 border-0 shadow-none rounded-2xl h-14",
                  }}
                />

                <Select
                  size="lg"
                  placeholder="Select car type"
                  aria-label="Car Type"
                  selectedKeys={[carType]}
                  onChange={(e) =>
                    setCarType(e.target.value || "All")
                  }
                  classNames={{
                    trigger:
                      "bg-default-100 border-0 shadow-none rounded-2xl h-14",
                  }}
                >
                  <SelectItem key="All" value="All">
                    All Types
                  </SelectItem>

                  <SelectItem key="SUV" value="SUV">
                    SUV
                  </SelectItem>

                  <SelectItem key="Sedan" value="Sedan">
                    Sedan
                  </SelectItem>

                  <SelectItem key="Hatchback" value="Hatchback">
                    Hatchback
                  </SelectItem>

                  <SelectItem key="Luxury" value="Luxury">
                    Luxury
                  </SelectItem>
                </Select>

                <Button
                  color="primary"
                  size="lg"
                  className="h-14 rounded-2xl font-bold text-base shadow-xl shadow-primary/20"
                  endContent={<ArrowRight className="w-5 h-5" />}
                >
                  Find Cars
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARS SECTION */}
      <section className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
          <div>
            <p className="text-primary font-semibold mb-2">
              Premium Collection
            </p>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
              Available Cars
            </h2>

            <p className="text-default-500 text-lg">
              {cars.length} vehicles available right now
            </p>
          </div>
        </div>

        {/* LOADING */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <Spinner size="lg" color="primary" />

            <p className="mt-4 text-default-500">
              Loading premium cars...
            </p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-divider rounded-3xl bg-content1">
            <div className="w-20 h-20 rounded-full bg-default-100 flex items-center justify-center mx-auto mb-6">
              <CarFront className="w-10 h-10 text-default-400" />
            </div>

            <h3 className="text-2xl font-bold mb-3">
              No Cars Found
            </h3>

            <p className="text-default-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {cars.map((car) => (
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

                  {/* Gradient Overlay */}
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
                    <Chip
                      variant="flat"
                      color="primary"
                      className="backdrop-blur-xl bg-primary/80 text-white border border-white/10"
                    >
                      {car.type}
                    </Chip>
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

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-[32px] ring-1 ring-primary/0 group-hover:ring-primary/20 transition-all pointer-events-none" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}