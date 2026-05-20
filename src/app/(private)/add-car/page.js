'use client';

import { Input, Textarea, Select, SelectItem, Button } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { Sparkles, Car, MapPin, DollarSign, Users } from "lucide-react";

export default function AddCar() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddCar = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const carData = {
      modelName: formData.get("modelName"),
      price: Number(formData.get("price")),
      type: formData.get("type"),
      seats: Number(formData.get("seats")),
      image: formData.get("image"),
      location: formData.get("location"),
      description: formData.get("description"),
      status: formData.get("status") || "Available"
    };

    try {
      await api.post("/cars", carData);
      toast.success("Car added successfully!");
      router.push("/my-cars");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add car");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl space-y-12">
      
      {/* Header Block */}
      <div className="space-y-4 border-b border-divider pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-default-100 text-primary rounded-full text-xs font-semibold tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          PARTNER FLEET
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
          Add a New Car
        </h1>
        <p className="text-lg text-default-500 font-medium max-w-2xl">
          List your luxury or commute vehicle on <span className="text-foreground font-bold">DriveFleet</span>. Earn premium rates from verified drivers in your city.
        </p>
      </div>

      {/* Form Block inside standard bg-content1 card with wide margins */}
      <div className="bg-content1 border border-divider rounded-[24px] p-8 md:p-12 shadow-2xl">
        <form className="space-y-12" onSubmit={handleAddCar}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
            
            {/* Model Name */}
            <div className="space-y-3">
              <label className="text-foreground font-extrabold text-sm tracking-wide block">Car Model Name</label>
              <Input 
                name="modelName" 
                placeholder="e.g. Honda Civic RS" 
                isRequired 
                variant="bordered"
                size="lg"
                startContent={<Car className="text-default-400 w-4 h-4 shrink-0 mr-1" />}
              />
            </div>

            {/* Price */}
            <div className="space-y-3">
              <label className="text-foreground font-extrabold text-sm tracking-wide block">Daily Rent Price ($)</label>
              <Input 
                name="price" 
                type="number" 
                placeholder="e.g. 95" 
                isRequired 
                variant="bordered"
                size="lg"
                startContent={<DollarSign className="text-default-400 w-4 h-4 shrink-0 mr-1" />}
              />
            </div>
            
            {/* Type */}
            <div className="space-y-3">
              <label className="text-foreground font-extrabold text-sm tracking-wide block">Car Type</label>
              <Select 
                name="type" 
                placeholder="Select car type" 
                isRequired 
                variant="bordered"
                size="lg"
              >
                <SelectItem key="SUV" value="SUV">SUV</SelectItem>
                <SelectItem key="Sedan" value="Sedan">Sedan</SelectItem>
                <SelectItem key="Hatchback" value="Hatchback">Hatchback</SelectItem>
                <SelectItem key="Luxury" value="Luxury">Luxury</SelectItem>
                <SelectItem key="Electric" value="Electric">Electric</SelectItem>
              </Select>
            </div>

            {/* Seat Capacity */}
            <div className="space-y-3">
              <label className="text-foreground font-extrabold text-sm tracking-wide block">Seat Capacity</label>
              <Input 
                name="seats" 
                type="number" 
                placeholder="e.g. 5" 
                isRequired 
                variant="bordered"
                size="lg"
                startContent={<Users className="text-default-400 w-4 h-4 shrink-0 mr-1" />}
              />
            </div>

            {/* Pickup Location */}
            <div className="space-y-3">
              <label className="text-foreground font-extrabold text-sm tracking-wide block">Pickup Location</label>
              <Input 
                name="location" 
                placeholder="e.g. Dhanmondi, Dhaka" 
                isRequired 
                variant="bordered"
                size="lg"
                startContent={<MapPin className="text-default-400 w-4 h-4 shrink-0 mr-1" />}
              />
            </div>

            {/* Availability Status */}
            <div className="space-y-3">
              <label className="text-foreground font-extrabold text-sm tracking-wide block">Availability Status</label>
              <Select 
                name="status" 
                placeholder="Select availability" 
                isRequired 
                variant="bordered"
                size="lg"
                defaultSelectedKeys={["Available"]}
              >
                <SelectItem key="Available" value="Available">Available</SelectItem>
                <SelectItem key="Unavailable" value="Unavailable">Unavailable</SelectItem>
              </Select>
            </div>

          </div>

          {/* Image URL */}
          <div className="space-y-3">
            <label className="text-foreground font-extrabold text-sm tracking-wide block">Image URL</label>
            <Input 
              name="image" 
              placeholder="https://images.unsplash.com/..." 
              isRequired 
              variant="bordered"
              size="lg"
            />
            <p className="text-xs text-default-400">Please provide a valid direct image URL.</p>
          </div>
          
          {/* Description */}
          <div className="space-y-3">
            <label className="text-foreground font-extrabold text-sm tracking-wide block">Description</label>
            <Textarea 
              name="description"
              placeholder="Describe the car's dynamic performance, condition, premium specs, etc." 
              isRequired 
              variant="bordered"
              size="lg"
              minRows={5}
            />
          </div>

          {/* Action Button */}
          <div className="pt-6">
            <Button 
              size="lg" 
              className="w-full mt-2 h-16 bg-primary hover:bg-primary/95 text-primary-foreground font-extrabold rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-[1.01] text-base tracking-wider" 
              type="submit" 
              isLoading={isLoading}
            >
              List Vehicle
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
