'use client';

import { Input, Textarea, Select, SelectItem, Button } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/axios";

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
      status: "Available"
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
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Add a New Car</h1>
      <p className="text-default-500 mb-8">List your vehicle on DriveFleet to start earning.</p>

      <div className="bg-content1 border border-divider rounded-2xl p-8">
        <form className="space-y-6" onSubmit={handleAddCar}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="modelName" label="Car Model Name" placeholder="e.g. Tesla Model S" isRequired variant="bordered" />
            <Input name="price" label="Daily Rent Price ($)" type="number" placeholder="e.g. 150" isRequired variant="bordered" />
            
            <Select name="type" label="Car Type" placeholder="Select type" isRequired variant="bordered">
              <SelectItem key="SUV" value="SUV">SUV</SelectItem>
              <SelectItem key="Sedan" value="Sedan">Sedan</SelectItem>
              <SelectItem key="Hatchback" value="Hatchback">Hatchback</SelectItem>
              <SelectItem key="Luxury" value="Luxury">Luxury</SelectItem>
            </Select>

            <Input name="seats" label="Seat Capacity" type="number" placeholder="e.g. 5" isRequired variant="bordered" />
          </div>

          <Input name="image" label="Image URL" placeholder="https://..." isRequired variant="bordered" description="Please provide a valid image URL (e.g. from postimages.org)" />
          
          <Input name="location" label="Pickup Location" placeholder="e.g. 123 Main St, City" isRequired variant="bordered" />
          
          <Textarea 
            name="description"
            label="Description" 
            placeholder="Describe the car's features, condition, etc." 
            isRequired 
            variant="bordered"
            minRows={4}
          />

          <Button color="primary" size="lg" className="w-full" type="submit" isLoading={isLoading}>
            List Vehicle
          </Button>
        </form>
      </div>
    </div>
  );
}
