'use client';

import { Button, Input, Select, SelectItem, Spinner } from "@heroui/react";
import { Search } from "lucide-react";
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
      const { data } = await api.get('/cars', {
        params: {
          search: searchQuery,
          type: carType !== "All" ? carType : undefined
        }
      });
      setCars(data);
    } catch (error) {
      console.error("Failed to fetch cars", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce or immediate fetch on load
    const timer = setTimeout(() => {
      fetchCars();
    }, 300); // 300ms debounce for search
    
    return () => clearTimeout(timer);
  }, [searchQuery, carType]);

  return (
    <div className="container mx-auto px-6 py-12 min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Explore Our Fleet</h1>
          <p className="text-default-500">Find the perfect car for your next adventure.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <Input 
            classNames={{ base: "w-full md:w-64" }}
            placeholder="Search by car name..."
            startContent={<Search className="text-default-400 w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select 
            className="w-full md:w-48" 
            placeholder="Car Type"
            aria-label="Filter by Car Type"
            selectedKeys={[carType]}
            onChange={(e) => setCarType(e.target.value || "All")}
          >
            <SelectItem key="All" value="All">All Types</SelectItem>
            <SelectItem key="SUV" value="SUV">SUV</SelectItem>
            <SelectItem key="Sedan" value="Sedan">Sedan</SelectItem>
            <SelectItem key="Hatchback" value="Hatchback">Hatchback</SelectItem>
            <SelectItem key="Luxury" value="Luxury">Luxury</SelectItem>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-20 text-default-500">
          <h3 className="text-xl font-semibold mb-2">No cars found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div key={car._id} className="bg-content1 border border-divider rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="aspect-[4/3] bg-default-200 relative">
                <img 
                  src={car.image || car.imageUrl} 
                  alt={car.modelName} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md px-2 py-1 rounded-md text-sm font-bold">
                  ${car.price}/d
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-1">{car.modelName}</h3>
                <p className="text-sm text-default-500 mb-4 line-clamp-2">
                  {car.description}
                </p>
                <div className="flex justify-between items-center text-xs text-default-500 mb-4">
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
    </div>
  );
}
