'use client';

import {
  Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure, Textarea, Select, SelectItem, Spinner, Input
} from "@heroui/react";
import { ArrowLeft, Calendar, Users, MapPin, User, Car } from "lucide-react";
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
        if (!data) { router.push("/not-found"); return; }
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
    if (!user) {
      toast.error("Please login to book a car.");
      router.push("/login");
      return;
    }
    setIsBooking(true);
    const formData = new FormData(e.target);
    const bookingData = {
      carId: car._id,
      carName: car.modelName,
      driverNeeded: formData.get("driverNeeded") === "true",
      specialNote: formData.get("specialNote") || "",
      bookingDate: formData.get("bookingDate")
        ? new Date(formData.get("bookingDate"))
        : new Date(),
      totalPrice: car.price,
      status: "Confirmed",
    };
    try {
      await api.post("/bookings", bookingData);
      toast.success("Car booked successfully!");
      onOpenChange(false);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!car) return null;

  const isAvailable = car.status === "Available";
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">

      {/* Back Link */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-default-500 hover:text-foreground mb-6 sm:mb-8 transition-colors font-bold text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Explore
      </Link>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">

        {/* Left — Image */}
        <div className="bg-content1 border border-divider rounded-2xl overflow-hidden p-3 sm:p-4 shadow-lg">
          <div className="aspect-[4/3] w-full rounded-xl overflow-hidden">
            <img
              src={car.image || car.imageUrl}
              alt={car.modelName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Mobile — Status + Price (shown below image on mobile) */}
          <div className="lg:hidden mt-3 bg-default-50 border border-divider p-4 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-default-400 text-xs font-bold uppercase tracking-wider block">
                Availability
              </span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 ${isAvailable ? "bg-success animate-pulse" : "bg-danger"}`} />
                <span className="text-base font-black text-foreground">{car.status}</span>
              </div>
            </div>
            <div className="text-right space-y-0.5">
              <span className="text-default-400 text-xs font-bold uppercase tracking-wider block">
                Daily Rate
              </span>
              <span className="text-xl font-black text-foreground">
                ${car.price}
                <span className="text-xs text-default-500 font-bold"> / day</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right — Details */}
        <div className="bg-content1 border border-divider rounded-2xl p-5 sm:p-8 shadow-lg space-y-6">

          {/* Title */}
          <div className="space-y-1.5">
            <span className="text-default-400 text-xs font-black tracking-widest uppercase block">
              {car.type}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
              {car.modelName}
            </h1>
          </div>

          {/* Desktop — Status + Price */}
          <div className="hidden lg:flex bg-default-50 border border-divider p-5 rounded-2xl items-center justify-between">
            <div className="space-y-1">
              <span className="text-default-400 text-xs font-bold uppercase tracking-wider block">
                Availability
              </span>
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full inline-block shrink-0 ${isAvailable ? "bg-success animate-pulse" : "bg-danger"}`} />
                <span className="text-xl font-black text-foreground">{car.status}</span>
              </div>
            </div>
            <div className="text-right space-y-1">
              <span className="text-default-400 text-xs font-bold uppercase tracking-wider block">
                Daily Rate
              </span>
              <span className="text-2xl font-black text-foreground">
                ${car.price}
                <span className="text-xs text-default-500 font-bold"> / day</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-default-600 font-medium leading-relaxed text-sm sm:text-base border-t border-divider pt-5">
            {car.description || "Sporty handling and a premium cabin for sharp city commutes."}
          </p>

          {/* Info Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-divider pt-5">
            {[
              {
                icon: <Calendar className="w-4 h-4 text-default-500 shrink-0" />,
                label: `Booked by ${car.booking_count || 0} user${car.booking_count === 1 ? "" : "s"}`,
              },
              {
                icon: <Users className="w-4 h-4 text-default-500 shrink-0" />,
                label: `${car.seats || 5} seats`,
              },
              {
                icon: <MapPin className="w-4 h-4 text-default-500 shrink-0" />,
                label: car.location || "Dhanmondi, Dhaka",
              },
              {
                icon: <User className="w-4 h-4 text-default-500 shrink-0" />,
                label: `Owner: ${car.addedBy || "DriveFleet Curated"}`,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-default-100/50 border border-divider px-4 py-3 rounded-xl flex items-center gap-3"
              >
                {item.icon}
                <span className="text-foreground font-semibold text-sm truncate">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Book Button */}
          <div className="pt-2 space-y-3 border-t border-divider">
            <Button
              onPress={onOpen}
              isDisabled={!isAvailable}
              color="primary"
              className="w-full h-14 font-extrabold text-base rounded-xl shadow-lg shadow-primary/20 transition-all"
            >
              {isAvailable ? "Book Now" : "Currently Unavailable"}
            </Button>
            {!user && (
              <p className="text-center text-sm text-default-500 font-medium">
                <Link href="/login" className="text-primary font-bold hover:underline">
                  Log in
                </Link>{" "}
                to book this car.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        scrollBehavior="inside"
        classNames={{
          base: "border border-divider rounded-2xl bg-content1 shadow-2xl mx-4 sm:mx-0",
          backdrop: "bg-black/50 backdrop-blur-md",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleBookNow}>
              <ModalHeader className="flex flex-col gap-1 border-b border-divider pb-4">
                <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  Complete Your Booking
                </h3>
                <p className="text-default-500 text-xs sm:text-sm font-medium">
                  Verify your rental information before finalizing.
                </p>
              </ModalHeader>

              <ModalBody className="py-5 space-y-5">
                {/* Summary */}
                <div className="bg-default-100/60 border border-divider p-4 rounded-xl space-y-2">
                  <p className="font-extrabold text-base sm:text-lg text-foreground">
                    {car.modelName}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-default-500 font-semibold">Base Price:</span>
                    <span className="text-foreground font-black">${car.price} / day</span>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-foreground font-bold text-sm block">
                    Select Rental Start Date
                  </label>
                  <Input
                    name="bookingDate"
                    type="date"
                    variant="bordered"
                    isRequired
                    size="md"
                    defaultValue={todayStr}
                    min={todayStr}
                  />
                </div>

                {/* Driver */}
                <div className="space-y-2">
                  <label className="text-foreground font-bold text-sm block">
                    Do you need a driver?
                  </label>
                  <Select
                    name="driverNeeded"
                    variant="bordered"
                    isRequired
                    size="md"
                    defaultSelectedKeys={["false"]}
                  >
                    <SelectItem key="false">No, I will drive myself</SelectItem>
                    <SelectItem key="true">Yes, I need a driver</SelectItem>
                  </Select>
                </div>

                {/* Special Note */}
                <div className="space-y-2">
                  <label className="text-foreground font-bold text-sm block">
                    Special Notes (optional)
                  </label>
                  <Textarea
                    name="specialNote"
                    placeholder="e.g. Need child seat, clean interior"
                    variant="bordered"
                    size="md"
                    minRows={3}
                  />
                </div>
              </ModalBody>

              <ModalFooter className="border-t border-divider pt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="font-bold w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  isLoading={isBooking}
                  className="font-bold w-full sm:w-auto"
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