"use client";

import { useState, useEffect } from "react";
import { getSuppliers, postSupplier, updateSupplier, deleteSupplier } from "@/app/apis/supplier/api";

type Supplier = {
  id: number;
  vendorName: string;
  email?: string;
  shopName: string;
  shopAddress?: string;
  telephoneNumber?: string;
};

export default function SuppliersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<Supplier>>({});
  const [errors, setErrors] = useState<Partial<Supplier>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    fetchSuppliers(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchSuppliers = async (page: number, size: number) => {
    try {
      const { data = [], total = 0 } = await getSuppliers(page, size);
      setSuppliers(data);
      setTotalCount(total);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Supplier> = {};
    if (!form.vendorName || typeof form.vendorName !== "string") {
      newErrors.vendorName = "Vendor Name should not be empty and must be a string.";
    }
    if (!form.shopName || typeof form.shopName !== "string") {
      newErrors.shopName = "Shop Name should not be empty and must be a string.";
    }
    if (!form.shopAddress || typeof form.shopAddress !== "string") {
      newErrors.shopAddress = "Shop Address should not be empty and must be a string.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openModal = (supplier?: Supplier) => {
    setForm(supplier || {});
    setEditingId(supplier?.id || null);
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({});
    setErrors({});
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (editingId !== null) {
        const updatedSupplier = await updateSupplier(String(editingId), form);
        setSuppliers((prev) =>
          prev.map((supplier) =>
            supplier.id === editingId ? { ...supplier, ...updatedSupplier } : supplier
          )
        );
      } else {
        const newSupplier = await postSupplier(form);
        setSuppliers((prev) => [...prev, newSupplier]);
      }
      closeModal();
    } catch (error: any) {
      console.error("Error submitting supplier:", error);
      alert(error.message || "Failed to submit supplier.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSupplier(String(id));
      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
    } catch (error: any) {
      console.error("Error deleting supplier:", error);
      alert(error.message || "Failed to delete supplier.");
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-700">Supplier Management</h1>
          <button
            onClick={() => openModal()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
          >
            + Add Supplier
          </button>
        </div>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Vendor Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Shop Name</th>
              <th className="border border-gray-300 px-4 py-2">Shop Address</th>
              <th className="border border-gray-300 px-4 py-2">Telephone</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No suppliers added yet.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td className="border px-4 py-2">{supplier.vendorName}</td>
                  <td className="border px-4 py-2">{supplier.email || "-"}</td>
                  <td className="border px-4 py-2">{supplier.shopName}</td>
                  <td className="border px-4 py-2">{supplier.shopAddress || "-"}</td>
                  <td className="border px-4 py-2">{supplier.telephoneNumber || "-"}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => openModal(supplier)}
                      className="bg-green-500 text-white py-1 px-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.id)}
                      className="bg-red-500 text-white py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center space-x-4 mt-4">
          <div className="flex space-x-2">
            <label className="font-medium">Page Size:</label>
            <select
              className="border border-gray-300 rounded-md px-2 py-1"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-3 py-2 bg-gray-300 rounded-lg ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`px-3 py-2 bg-gray-300 rounded-lg ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Supplier" : "Add Supplier"}
            </h2>
            <div className="space-y-4">
              <div>
                <input
                  name="vendorName"
                  placeholder="Vendor Name"
                  value={form.vendorName || ""}
                  onChange={handleChange}
                  className={`block w-full border rounded p-2 ${
                    errors.vendorName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.vendorName && (
                  <p className="text-red-500 text-sm mt-1">{errors.vendorName}</p>
                )}
              </div>
              <input
                name="email"
                placeholder="Email"
                value={form.email || ""}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded p-2"
              />
              <div>
                <input
                  name="shopName"
                  placeholder="Shop Name"
                  value={form.shopName || ""}
                  onChange={handleChange}
                  className={`block w-full border rounded p-2 ${
                    errors.shopName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.shopName && (
                  <p className="text-red-500 text-sm mt-1">{errors.shopName}</p>
                )}
              </div>
              <div>
                <input
                  name="shopAddress"
                  placeholder="Shop Address"
                  value={form.shopAddress || ""}
                  onChange={handleChange}
                  className={`block w-full border rounded p-2 ${
                    errors.shopAddress ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.shopAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.shopAddress}</p>
                )}
              </div>
              <input
                name="telephoneNumber"
                placeholder="Telephone Number"
                value={form.telephoneNumber || ""}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
