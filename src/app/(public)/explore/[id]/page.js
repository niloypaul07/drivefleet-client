'use client';

import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea, Select, SelectItem, Spinner, Chip, Divider, Input } from "@heroui/react";
import { ArrowLeft, Calendar, Users, MapPin, User, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function CarDetails({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();

  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isBooking, setIsBooking] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;

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
      bookingDate: formData.get("bookingDate") ? new Date(formData.get("bookingDate")) : new Date(),
      totalPrice: car.price,
      status: "Confirmed"
    };

    try {
      await api.post("/bookings", bookingData);
      toast.success("Car booked successfully!");
      onOpenChange(false);
      
      // Fetch updated car details to show incremented booking count immediately
      const updatedCar = await api.get(`/cars/${id}`);
      setCar(updatedCar.data);

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
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      
      {/* Back Link */}
      <Link href="/explore" className="inline-flex items-center gap-2 text-default-500 hover:text-foreground mb-8 transition-colors font-extrabold text-sm tracking-wide">
        <ArrowLeft className="w-4 h-4 stroke-[3px]" /> BACK TO EXPLORE
      </Link>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Premium Image Card */}
        <div className="lg:col-span-6 bg-content1 border border-divider rounded-[24px] overflow-hidden p-4 shadow-xl">
          <div className="aspect-[4/3] w-full rounded-[18px] overflow-hidden relative">
            <img src={car.image || car.imageUrl} alt={car.modelName} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Right Column: Dynamic Car Specs & Info */}
        <div className="lg:col-span-6 bg-content1 border border-divider rounded-[24px] p-8 md:p-10 shadow-xl space-y-8">
          
          {/* Category & Title */}
          <div className="space-y-3">
            <span className="text-default-400 text-xs font-black tracking-widest uppercase block">{car.type}</span>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">{car.modelName}</h1>
          </div>

          {/* Modern Status & Price Card */}
          <div className="bg-default-50 border border-divider p-6 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-default-400 text-xs font-bold uppercase tracking-wider block">AVAILABILITY</span>
              <div className="flex items-center gap-2.5">
                <span className={`w-3.5 h-3.5 rounded-full inline-block ${car.status === "Available" ? "bg-primary animate-pulse" : "bg-danger"}`}></span>
                <span className="text-xl font-black text-foreground tracking-wide">{car.status}</span>
              </div>
            </div>
            <div className="text-right space-y-1">
              <span className="text-default-400 text-xs font-bold uppercase tracking-wider block">DAILY RATE</span>
              <span className="text-2xl font-black text-foreground">${car.price} <span className="text-xs text-default-500 font-bold">/ DAY</span></span>
            </div>
          </div>

          {/* Description Paragraph */}
          <p className="text-default-600 font-medium leading-relaxed text-base border-t border-divider pt-6">
            {car.description || "Sporty handling and a premium cabin for sharp city commutes."}
          </p>

          {/* Premium Info Row Pills */}
          <div className="space-y-3.5 border-t border-divider pt-6">
            
            {/* Calendar Pill */}
            <div className="bg-default-100/50 border border-divider px-5 py-4 rounded-xl flex items-center gap-3.5">
              <Calendar className="w-5 h-5 text-default-500" />
              <span className="text-foreground font-bold text-sm">
                Booked by {car.booking_count || 0} user{car.booking_count === 1 ? '' : 's'}
              </span>
            </div>

            {/* Seats Pill */}
            <div className="bg-default-100/50 border border-divider px-5 py-4 rounded-xl flex items-center gap-3.5">
              <Users className="w-5 h-5 text-default-500" />
              <span className="text-foreground font-bold text-sm">{car.seats || 5} seats</span>
            </div>

            {/* Location Pill */}
            <div className="bg-default-100/50 border border-divider px-5 py-4 rounded-xl flex items-center gap-3.5">
              <MapPin className="w-5 h-5 text-default-500" />
              <span className="text-foreground font-bold text-sm">{car.location || "Dhanmondi, Dhaka"}</span>
            </div>

            {/* Owner Pill */}
            <div className="bg-default-100/50 border border-divider px-5 py-4 rounded-xl flex items-center gap-3.5">
              <User className="w-5 h-5 text-default-500" />
              <span className="text-foreground font-bold text-sm truncate">
                Owner: {car.addedBy || "DriveFleet Curated"}
              </span>
            </div>
          </div>

          {/* Booking Trigger Button */}
          <div className="pt-4 space-y-4 border-t border-divider">
            <Button 
              onClick={onOpen} 
              isDisabled={car.status !== "Available"}
              className="w-full h-16 bg-primary disabled:bg-default-200 text-white disabled:text-default-400 font-extrabold text-base rounded-xl shadow-xl shadow-primary/10 transition-all duration-300 transform hover:scale-[1.01] hover:opacity-90"
            >
              {car.status === "Available" ? "Book Now" : "Currently Unavailable"}
            </Button>

            {/* Inline Login Reminder link if user is guest */}
            {!user && (
              <div className="text-center">
                <Link href="/login" className="text-sm font-bold text-primary underline hover:text-primary/80 transition-colors">
                  Log in
                </Link>
                <span className="text-sm text-default-500 font-semibold"> to book this car.</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Centered Premium Booking Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        classNames={{
          base: "border border-divider rounded-[24px] bg-content1 p-6 shadow-2xl max-w-xl",
          backdrop: "bg-[#121212]/50 backdrop-blur-md"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleBookNow} className="space-y-6">
              
              {/* Header */}
              <ModalHeader className="px-0 pt-2 flex flex-col gap-1.5 border-b border-divider pb-4">
                <h3 className="text-2xl font-black text-foreground tracking-tight">Complete Your Booking</h3>
                <p className="text-default-500 text-sm font-medium">Verify your rental information before finalizing.</p>
              </ModalHeader>
              
              {/* Body */}
              <ModalBody className="px-0 space-y-6">
                
                {/* Summary Box */}
                <div className="bg-default-100/50 border border-divider p-5 rounded-xl space-y-2">
                  <p className="font-extrabold text-lg text-foreground">{car.modelName}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-default-500 font-semibold">Base Price:</span>
                    <span className="text-foreground font-black">${car.price} / day</span>
                  </div>
                </div>

                {/* Rental Date Picker */}
                <div className="space-y-2.5">
                  <label className="text-foreground font-extrabold text-sm tracking-wide block">Select Rental Start Date</label>
                  <Input
                    name="bookingDate"
                    type="date"
                    variant="bordered"
                    isRequired
                    size="lg"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Driver Option Selector */}
                <div className="space-y-2.5">
                  <label className="text-foreground font-extrabold text-sm tracking-wide block">Do you need a driver?</label>
                  <Select 
                    name="driverNeeded" 
                    variant="bordered" 
                    isRequired 
                    size="lg"
                    defaultSelectedKeys={["false"]}
                  >
                    <SelectItem key="false" value="false">No, I will drive myself</SelectItem>
                    <SelectItem key="true" value="true">Yes, I need a driver</SelectItem>
                  </Select>
                </div>

                {/* Special Notes Description */}
                <div className="space-y-2.5">
                  <label className="text-foreground font-extrabold text-sm tracking-wide block">Special Notes or Requests</label>
                  <Textarea
                    name="specialNote"
                    placeholder="e.g. Need child seat, clean interior"
                    variant="bordered"
                    size="lg"
                    minRows={3}
                  />
                </div>
              </ModalBody>
              
              {/* Footer */}
              <ModalFooter className="px-0 pb-2 pt-4 border-t border-divider flex justify-end gap-3.5">
                <Button 
                  color="danger" 
                  variant="light" 
                  onClick={onClose}
                  className="font-extrabold text-sm hover:bg-default-100 h-12 px-6 rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  isLoading={isBooking}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-extrabold text-sm h-12 px-8 rounded-xl shadow-lg transition-all"
                >
                  Confirm Booking
                </Button>
              </ModalFooter>

            </form>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
}
