'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Spinner } from "@heroui/react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

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

  if (isLoading) return <div className="flex justify-center items-center h-[50vh]"><Spinner size="lg" /></div>;

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
      <p className="text-default-500 mb-8">View and manage your rental history and upcoming trips.</p>

      <Table aria-label="My bookings table">
        <TableHeader>
          <TableColumn>CAR</TableColumn>
          <TableColumn>BOOKING DATE</TableColumn>
          <TableColumn>DRIVER</TableColumn>
          <TableColumn>TOTAL PRICE</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"You have no bookings yet."}>
          {bookings.map((booking) => (
            <TableRow key={booking._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{booking.carName}</span>
                </div>
              </TableCell>
              <TableCell>{format(new Date(booking.bookingDate), "PPp")}</TableCell>
              <TableCell>{booking.driverNeeded ? "Requested" : "No"}</TableCell>
              <TableCell className="font-semibold">${booking.totalPrice}</TableCell>
              <TableCell>
                <Chip color="success" variant="flat">{booking.status || "Confirmed"}</Chip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
