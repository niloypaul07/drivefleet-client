'use client';

import { Chip, Spinner } from "@heroui/react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { Calendar, User, FileText, DollarSign, BookOpen } from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get("/my-bookings");
        setBookings(data);
      } catch (error) {
        toast.error("Failed to load your bookings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "success";
      case "pending": return "warning";
      case "cancelled": return "danger";
      default: return "success";
    }
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), "PPp");
    } catch {
      return format(new Date(), "PPp");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">My Bookings</h1>
        <p className="text-default-500 text-sm sm:text-base">
          View and manage your rental history and upcoming trips.
        </p>
      </div>

      {bookings.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 gap-4 border border-dashed border-divider rounded-2xl">
          <BookOpen className="w-12 h-12 text-default-300" />
          <p className="text-default-500 font-medium">You have no bookings yet.</p>
          <Link
            href="/explore"
            className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Explore Cars
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-divider">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-default-100 border-b border-divider">
                  {["Car", "Booking Date", "Driver", "Special Note", "Total Price", "Status"].map((col) => (
                    <th
                      key={col}
                      className="text-left px-6 py-4 font-semibold text-default-600 uppercase text-xs tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-default-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground whitespace-nowrap">
                        {booking.carName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/explore/${booking.carId}`}
                        className="text-primary hover:underline font-medium whitespace-nowrap"
                      >
                        {formatDate(booking.bookingDate)}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                        ${booking.driverNeeded
                          ? "bg-primary/10 text-primary"
                          : "bg-default-100 text-default-500"
                        }`}
                      >
                        {booking.driverNeeded ? "Requested" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[180px]">
                      <p className="truncate text-default-500 italic text-sm">
                        {booking.specialNote || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-foreground">${booking.totalPrice}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Chip
                        color={getStatusColor(booking.status)}
                        variant="flat"
                        size="sm"
                        className="font-semibold capitalize"
                      >
                        {booking.status || "Confirmed"}
                      </Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-content1 border border-divider rounded-2xl overflow-hidden"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-divider">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-bold text-foreground truncate">
                      {booking.carName}
                    </span>
                    <Link
                      href={`/explore/${booking.carId}`}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      View Car →
                    </Link>
                  </div>
                  <Chip
                    color={getStatusColor(booking.status)}
                    variant="flat"
                    size="sm"
                    className="font-semibold capitalize shrink-0 ml-2"
                  >
                    {booking.status || "Confirmed"}
                  </Chip>
                </div>

                {/* Card Body */}
                <div className="px-4 py-4 space-y-3">
                  {/* Booking Date */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-default-100 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-default-500" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-default-400 font-medium">Booking Date</span>
                      <span className="text-sm font-semibold text-foreground">
                        {formatDate(booking.bookingDate)}
                      </span>
                    </div>
                  </div>

                  {/* Driver */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-default-100 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-default-500" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-default-400 font-medium">Driver</span>
                      <span className={`text-sm font-semibold
                        ${booking.driverNeeded ? "text-primary" : "text-default-500"}`}
                      >
                        {booking.driverNeeded ? "Driver Requested" : "No Driver"}
                      </span>
                    </div>
                  </div>

                  {/* Special Note */}
                  {booking.specialNote && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-default-100 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-default-500" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-default-400 font-medium">Special Note</span>
                        <span className="text-sm text-default-500 italic line-clamp-2">
                          {booking.specialNote}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer — Total Price */}
                <div className="flex items-center justify-between px-4 py-3 bg-default-50 border-t border-divider">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-default-400" />
                    <span className="text-xs text-default-400 font-medium">Total Price</span>
                  </div>
                  <span className="text-base font-extrabold text-foreground">
                    ${booking.totalPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}