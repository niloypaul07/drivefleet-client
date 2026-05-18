'use client';

import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Select, SelectItem, Textarea, Spinner } from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function MyCars() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedCar, setSelectedCar] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyCars = async () => {
    try {
      const { data } = await api.get("/my-cars");
      setCars(data);
    } catch (error) {
      toast.error("Failed to fetch your cars");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCars();
  }, []);

  const openEditModal = (car) => {
    setSelectedCar(car);
    setIsEditOpen(true);
  };

  const openDeleteModal = (car) => {
    setSelectedCar(car);
    setIsDeleteOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const formData = new FormData(e.target);
    const updateData = {
      modelName: selectedCar.modelName, // Some fields aren't editable per requirements, but let's allow basic edits
      price: Number(formData.get("price")),
      type: formData.get("type"),
      seats: selectedCar.seats,
      image: formData.get("image"),
      location: formData.get("location"),
      description: formData.get("description"),
      status: formData.get("status")
    };

    try {
      await api.put(`/cars/${selectedCar._id}`, updateData);
      toast.success("Car updated successfully");
      fetchMyCars();
      setIsEditOpen(false);
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/cars/${selectedCar._id}`);
      toast.success("Car deleted");
      fetchMyCars();
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-[50vh]"><Spinner size="lg" /></div>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">My Added Cars</h1>
      <p className="text-default-500 mb-8">Manage the vehicles you have listed on DriveFleet.</p>

      <Table aria-label="My listed cars table">
        <TableHeader>
          <TableColumn>CAR MODEL</TableColumn>
          <TableColumn>TYPE</TableColumn>
          <TableColumn>PRICE / DAY</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn align="center">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"You haven't listed any cars yet."}>
          {cars.map((car) => (
            <TableRow key={car._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-default-200 rounded-md overflow-hidden shrink-0">
                    <img src={car.image || car.imageUrl} className="w-full h-full object-cover" alt={car.modelName} />
                  </div>
                  <span className="font-semibold">{car.modelName}</span>
                </div>
              </TableCell>
              <TableCell>{car.type}</TableCell>
              <TableCell>${car.price}</TableCell>
              <TableCell>
                <span className={`text-sm font-semibold ${car.status === 'Available' ? 'text-success' : 'text-danger'}`}>
                  {car.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={() => {
                      console.log("Opening edit modal for:", car);
                      openEditModal(car);
                    }} 
                    className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors duration-200"
                    title="Edit Car"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      console.log("Opening delete modal for:", car);
                      openDeleteModal(car);
                    }} 
                    className="p-2 hover:bg-danger/10 rounded-lg text-danger transition-colors duration-200"
                    title="Delete Car"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Custom Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-all duration-300">
          <div className="relative w-full max-w-2xl bg-content1 border border-divider rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <form onSubmit={handleUpdate}>
              <div className="px-6 py-4 border-b border-divider">
                <h3 className="text-xl font-bold text-foreground">Update Car Details</h3>
              </div>
              <div className="p-6">
                {selectedCar && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="price" label="Daily Rent Price ($)" type="number" defaultValue={selectedCar.price} isRequired variant="bordered" />
                    <Select name="type" label="Car Type" defaultSelectedKeys={[selectedCar.type]} isRequired variant="bordered">
                      <SelectItem key="SUV" value="SUV">SUV</SelectItem>
                      <SelectItem key="Sedan" value="Sedan">Sedan</SelectItem>
                      <SelectItem key="Hatchback" value="Hatchback">Hatchback</SelectItem>
                      <SelectItem key="Luxury" value="Luxury">Luxury</SelectItem>
                    </Select>
                    <Select name="status" label="Availability Status" defaultSelectedKeys={[selectedCar.status]} isRequired variant="bordered">
                      <SelectItem key="Available" value="Available">Available</SelectItem>
                      <SelectItem key="Unavailable" value="Unavailable">Unavailable</SelectItem>
                    </Select>
                    <Input name="location" label="Location" defaultValue={selectedCar.location} isRequired variant="bordered" />
                    <Input name="image" className="md:col-span-2" label="Image URL" defaultValue={selectedCar.image || selectedCar.imageUrl} isRequired variant="bordered" />
                    <Textarea name="description" className="md:col-span-2" label="Description" defaultValue={selectedCar.description} isRequired variant="bordered" />
                  </div>
                )}
              </div>
              <div className="px-6 py-4 bg-default-50 border-t border-divider flex justify-end gap-3">
                <Button color="danger" variant="light" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={isUpdating}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-all duration-300">
          <div className="relative w-full max-w-md bg-content1 border border-divider rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-divider">
              <h3 className="text-xl font-bold text-foreground">Confirm Deletion</h3>
            </div>
            <div className="p-6 space-y-2">
              <p className="text-foreground">Are you sure you want to delete <b>{selectedCar?.modelName}</b>?</p>
              <p className="text-sm text-default-500">This action cannot be undone and will permanently remove this listing.</p>
            </div>
            <div className="px-6 py-4 bg-default-50 border-t border-divider flex justify-end gap-3">
              <Button color="default" variant="light" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button color="danger" onClick={handleDelete} isLoading={isDeleting}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
