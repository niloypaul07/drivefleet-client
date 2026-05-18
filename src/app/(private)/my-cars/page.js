'use client';

import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Select, SelectItem, Textarea, Spinner } from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function MyCars() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditChange} = useDisclosure();
  const {isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteChange} = useDisclosure();
  
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
    onEditOpen();
  };

  const openDeleteModal = (car) => {
    setSelectedCar(car);
    onDeleteOpen();
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
      onEditChange(false);
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
      onDeleteChange(false);
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
                  <Button isIconOnly size="sm" variant="light" color="primary" onClick={() => openEditModal(car)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button isIconOnly size="sm" variant="light" color="danger" onClick={() => openDeleteModal(car)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleUpdate}>
              <ModalHeader className="flex flex-col gap-1">Update Car Details</ModalHeader>
              <ModalBody>
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
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={isUpdating}>
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirm Deletion</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete <b>{selectedCar?.modelName}</b>?</p>
                <p className="text-sm text-default-500">This action cannot be undone.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onClick={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onClick={handleDelete} isLoading={isDeleting}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
