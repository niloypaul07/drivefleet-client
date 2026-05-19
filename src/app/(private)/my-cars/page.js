'use client';

import {
  Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, Select, SelectItem, Textarea, Spinner, Chip
} from "@heroui/react";
import { Edit, Trash2, Car, MapPin, DollarSign, Tag } from "lucide-react";
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

  useEffect(() => { fetchMyCars(); }, []);

  const openEditModal = (car) => { setSelectedCar(car); setIsEditOpen(true); };
  const openDeleteModal = (car) => { setSelectedCar(car); setIsDeleteOpen(true); };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const formData = new FormData(e.target);
    const updateData = {
      modelName: selectedCar.modelName,
      price: Number(formData.get("price")),
      type: formData.get("type"),
      seats: selectedCar.seats,
      image: formData.get("image"),
      location: formData.get("location"),
      description: formData.get("description"),
      status: formData.get("status"),
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
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">My Added Cars</h1>
        <p className="text-default-500 text-sm sm:text-base">
          Manage the vehicles you have listed on DriveFleet.
        </p>
      </div>

      {cars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 border border-dashed border-divider rounded-2xl">
          <Car className="w-12 h-12 text-default-300" />
          <p className="text-default-500 font-medium">You haven't listed any cars yet.</p>
          <Button color="primary" size="sm" as="a" href="/add-car">Add Your First Car</Button>
        </div>
      ) : (
        <>
          {/* Desktop Table — hidden on mobile */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-divider">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-default-100 border-b border-divider">
                  <th className="text-left px-6 py-4 font-semibold text-default-600 uppercase text-xs tracking-wider">Car Model</th>
                  <th className="text-left px-6 py-4 font-semibold text-default-600 uppercase text-xs tracking-wider">Type</th>
                  <th className="text-left px-6 py-4 font-semibold text-default-600 uppercase text-xs tracking-wider">Price / Day</th>
                  <th className="text-left px-6 py-4 font-semibold text-default-600 uppercase text-xs tracking-wider">Status</th>
                  <th className="text-center px-6 py-4 font-semibold text-default-600 uppercase text-xs tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {cars.map((car) => (
                  <tr key={car._id} className="hover:bg-default-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-default-200 rounded-xl overflow-hidden shrink-0">
                          <img
                            src={car.image || car.imageUrl}
                            className="w-full h-full object-cover"
                            alt={car.modelName}
                          />
                        </div>
                        <span className="font-semibold text-foreground">{car.modelName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-default-100 px-3 py-1 rounded-lg text-xs font-semibold text-default-600">
                        {car.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-foreground">${car.price}</span>
                      <span className="text-default-400 text-xs ml-1">/day</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                        ${car.status === 'Available'
                          ? 'bg-success/10 text-success'
                          : 'bg-danger/10 text-danger'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${car.status === 'Available' ? 'bg-success' : 'bg-danger'}`} />
                        {car.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(car)}
                          className="p-2 hover:bg-primary/10 rounded-xl text-primary transition-colors"
                          title="Edit Car"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(car)}
                          className="p-2 hover:bg-danger/10 rounded-xl text-danger transition-colors"
                          title="Delete Car"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards — shown only on mobile */}
          <div className="md:hidden space-y-4">
            {cars.map((car) => (
              <div
                key={car._id}
                className="bg-content1 border border-divider rounded-2xl overflow-hidden"
              >
                {/* Car Image + Name */}
                <div className="flex items-center gap-4 p-4 border-b border-divider">
                  <div className="w-16 h-16 bg-default-200 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={car.image || car.imageUrl}
                      className="w-full h-full object-cover"
                      alt={car.modelName}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground truncate">{car.modelName}</h3>
                    <span className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold
                      ${car.status === 'Available'
                        ? 'bg-success/10 text-success'
                        : 'bg-danger/10 text-danger'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${car.status === 'Available' ? 'bg-success' : 'bg-danger'}`} />
                      {car.status}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-3 divide-x divide-divider">
                  <div className="flex flex-col items-center py-3 px-2 gap-1">
                    <Tag className="w-3.5 h-3.5 text-default-400" />
                    <span className="text-xs text-default-400">Type</span>
                    <span className="text-xs font-bold text-foreground">{car.type}</span>
                  </div>
                  <div className="flex flex-col items-center py-3 px-2 gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-default-400" />
                    <span className="text-xs text-default-400">Per Day</span>
                    <span className="text-xs font-bold text-foreground">${car.price}</span>
                  </div>
                  <div className="flex flex-col items-center py-3 px-2 gap-1">
                    <MapPin className="w-3.5 h-3.5 text-default-400" />
                    <span className="text-xs text-default-400">Location</span>
                    <span className="text-xs font-bold text-foreground truncate max-w-[80px] text-center">{car.location || "N/A"}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 divide-x divide-divider border-t border-divider">
                  <button
                    onClick={() => openEditModal(car)}
                    className="flex items-center justify-center gap-2 py-3 text-primary hover:bg-primary/5 transition-colors text-sm font-semibold"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(car)}
                    className="flex items-center justify-center gap-2 py-3 text-danger hover:bg-danger/5 transition-colors text-sm font-semibold"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
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
            <form onSubmit={handleUpdate}>
              <ModalHeader className="flex flex-col gap-1 border-b border-divider pb-4">
                <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  Update Car Details
                </h3>
                <p className="text-default-500 text-xs sm:text-sm font-medium">
                  Modify the listing rates, availability status, or images.
                </p>
              </ModalHeader>

              <ModalBody className="py-6">
                {selectedCar && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-2">
                      <label className="text-foreground font-bold text-sm block">Daily Rent Price ($)</label>
                      <Input name="price" type="number" defaultValue={selectedCar.price} isRequired variant="bordered" size="md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-foreground font-bold text-sm block">Car Type</label>
                      <Select name="type" defaultSelectedKeys={[selectedCar.type]} isRequired variant="bordered" size="md">
                        <SelectItem key="SUV">SUV</SelectItem>
                        <SelectItem key="Sedan">Sedan</SelectItem>
                        <SelectItem key="Hatchback">Hatchback</SelectItem>
                        <SelectItem key="Luxury">Luxury</SelectItem>
                        <SelectItem key="Electric">Electric</SelectItem>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-foreground font-bold text-sm block">Availability Status</label>
                      <Select name="status" defaultSelectedKeys={[selectedCar.status]} isRequired variant="bordered" size="md">
                        <SelectItem key="Available">Available</SelectItem>
                        <SelectItem key="Unavailable">Unavailable</SelectItem>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-foreground font-bold text-sm block">Location</label>
                      <Input name="location" defaultValue={selectedCar.location} isRequired variant="bordered" size="md" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-foreground font-bold text-sm block">Image URL</label>
                      <Input name="image" defaultValue={selectedCar.image || selectedCar.imageUrl} isRequired variant="bordered" size="md" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-foreground font-bold text-sm block">Description</label>
                      <Textarea name="description" defaultValue={selectedCar.description} isRequired variant="bordered" size="md" minRows={3} />
                    </div>
                  </div>
                )}
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
                  isLoading={isUpdating}
                  className="font-bold w-full sm:w-auto"
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        placement="center"
        backdrop="blur"
        classNames={{
          base: "border border-divider rounded-2xl bg-content1 shadow-2xl mx-4 sm:mx-0",
          backdrop: "bg-black/50 backdrop-blur-md",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b border-divider pb-4">
                <h3 className="text-xl font-black text-foreground tracking-tight">Confirm Deletion</h3>
              </ModalHeader>
              <ModalBody className="py-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center">
                    <Trash2 className="w-8 h-8 text-danger" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-foreground font-semibold">
                      Are you sure you want to delete{" "}
                      <span className="font-extrabold">{selectedCar?.modelName}</span>?
                    </p>
                    <p className="text-sm text-default-500">
                      This action cannot be undone and will permanently remove this vehicle listing.
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-divider pt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="light"
                  onPress={onClose}
                  className="font-bold w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={handleDelete}
                  isLoading={isDeleting}
                  className="font-bold w-full sm:w-auto"
                >
                  Delete Vehicle
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}