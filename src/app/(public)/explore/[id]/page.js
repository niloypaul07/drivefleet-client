'use client';

import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea, Select, SelectItem, Spinner, Chip, Divider } from "@heroui/react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CarDetails({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();

  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const { data } = await api.get(`/cars/${id}`);
        if (!data) {
          router.push("/not-found");
          return;
        }
        setCar(data);
      } catch (error) {
        toast.error("Failed to fetch car details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCarDetails();
  }, [id, router]);

  const handleBookNow = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    const formData = new FormData(e.target);

    const bookingData = {
      carId: car._id,
      carName: car.modelName,
      driverNeeded: formData.get("driverNeeded") === "true",
      specialNote: formData.get("specialNote"),
      totalPrice: car.price,
      status: "Confirmed"
    };

    try {
      await api.post("/bookings", bookingData);
      toast.success("Car booked successfully!");
      onOpenChange(false);
      router.push("/my-bookings");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to book a car.");
        router.push("/login");
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-[70vh]"><Spinner size="lg" /></div>;
  if (!car) return null;

  return (
    <div className="container mx-auto px-6 py-12">
      <Link href="/explore" className="inline-flex items-center gap-2 text-default-500 hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="rounded-2xl overflow-hidden border border-divider h-[400px] lg:h-[500px]">
          <img src={car.image || car.imageUrl} alt={car.modelName} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-extrabold">{car.modelName}</h1>
              <div className="text-2xl font-bold text-primary">${car.price} <span className="text-sm text-default-500 font-normal">/ day</span></div>
            </div>
            <div className="flex gap-2">
              <Chip color={car.status === "Available" ? "success" : "danger"} variant="flat">{car.status}</Chip>
              <Chip variant="flat">{car.type}</Chip>
            </div>
          </div>

          <Divider />

          <div>
            <h3 className="text-xl font-semibold mb-3">Specifications</h3>
            <ul className="grid grid-cols-2 gap-4">
              <li className="flex items-center gap-2 text-default-600">
                <CheckCircle2 className="w-5 h-5 text-primary" /> {car.seats} Seats
              </li>
              <li className="flex items-center gap-2 text-default-600">
                <CheckCircle2 className="w-5 h-5 text-primary" /> Pick-up: {car.location}
              </li>
            </ul>
          </div>

          <Divider />

          <div>
            <h3 className="text-xl font-semibold mb-3">Description</h3>
            <p className="text-default-600 leading-relaxed">{car.description}</p>
          </div>

          <div className="pt-8">
            <Button color="primary" size="lg" className="w-full shadow-xl" onClick={onOpen} isDisabled={car.status !== "Available"}>
              {car.status === "Available" ? "Book Now" : "Currently Unavailable"}
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleBookNow}>
              <ModalHeader className="flex flex-col gap-1">Complete Your Booking</ModalHeader>
              <ModalBody>
                <div className="bg-default-50 p-4 rounded-xl border border-divider mb-4">
                  <p className="font-semibold">{car.modelName}</p>
                  <p className="text-sm text-default-500">Total Price: <span className="text-foreground font-bold">${car.price}</span></p>
                </div>

                <Select name="driverNeeded" label="Do you need a driver?" variant="bordered" isRequired defaultSelectedKeys={["false"]}>
                  <SelectItem key="false" value="false">No, I will drive myself</SelectItem>
                  <SelectItem key="true" value="true">Yes, I need a driver</SelectItem>
                </Select>

                <Textarea
                  name="specialNote"
                  label="Special Notes or Requests"
                  placeholder="e.g. Need child seat"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>Cancel</Button>
                <Button color="primary" type="submit" isLoading={isBooking}>Confirm Booking</Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
