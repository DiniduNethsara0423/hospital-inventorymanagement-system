'use client';

import { useState, useEffect } from "react";
import { postSupplier } from "@/app/apis/supplier/api";
import { Plus, Edit, Trash } from "lucide-react";

type Supplier = {
  id: number;
  vendorName: string;
  email?: string;
  shopName: string;
  shopAddress?: string;
  telephoneNumber?: string;
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<Supplier>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch suppliers from server if required (not implemented here)
  }, []);

  const openModal = (supplier?: Supplier) => {
    if (supplier) {
      setForm(supplier);
      setEditingId(supplier.id);
    } else {
      setForm({});
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({});
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const newSupplier = {
        vendor_id: editingId !== null ? String(editingId) : String(Date.now()), // Ensure vendor_id is a string
        vendorName: form.vendorName || "",
        email: form.email || "",
        shopName: form.shopName || "",
        shopAddress: form.shopAddress || "",
        telephoneNumber: form.telephoneNumber || "",
      };

      const response = await postSupplier(newSupplier);

      if (editingId !== null) {
        setSuppliers((prev) =>
          prev.map((supplier) =>
            supplier.id === editingId ? { ...supplier, ...newSupplier } : supplier
          )
        );
      } else {
        setSuppliers([...suppliers, { id: response.id, ...response }]);
      }

      closeModal();
    } catch (error) {
      console.error("Error adding supplier:", error);
      alert(error.message || "Failed to add supplier.");
    }
  };

  const handleDelete = (id: number) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
  };

  return (
    <div className="mt-12 mx-3">
      <div className="">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-700">Supplier Management</h1>
          <button
            onClick={() => openModal()}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Add Supplier</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse  border-gray-300 shadow-sm rounded-md">
            <thead className="bg-blue-200 text-left">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg text-gray-800">
                  Vendor Name
                </th>
                <th className="border px-4 py-3 text-gray-800">
                  Email
                </th>
                <th className="border px-4 py-3 text-gray-800">
                  Shop Name
                </th>
                <th className="border px-4 py-3 text-gray-800">
                  Shop Address
                </th>
                <th className="border px-4 py-3 text-gray-800">
                  Telephone
                </th>
                <th className="px-4 py-3 rounded-tr-lg text-gray-800 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500 text-sm bg-gray-50"
                  >
                    No suppliers added yet.
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr key={supplier.id} className="bg-white even:bg-gray-50">
                    <td className="border border-gray-300 px-6 py-4">
                      {supplier.vendorName}
                    </td>
                    <td className="border border-gray-300 px-6 py-4">
                      {supplier.email || "-"}
                    </td>
                    <td className="border border-gray-300 px-6 py-4">
                      {supplier.shopName}
                    </td>
                    <td className="border border-gray-300 px-6 py-4">
                      {supplier.shopAddress || "-"}
                    </td>
                    <td className="border border-gray-300 px-6 py-4">
                      {supplier.telephoneNumber || "-"}
                    </td>
                    <td className="border border-gray-300 px-6 py-4 flex justify-center space-x-4">
                      <button
                        onClick={() => openModal(supplier)}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 shadow-md flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 shadow-md flex items-center space-x-2"
                      >
                        <Trash className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal for Add/Edit Supplier */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex justify-center items-center z-50">
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xl relative">
      {/* Close Icon */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      
      {/* Modal Title */}
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        {editingId ? "Edit Supplier" : "Add Supplier"}
      </h2>

      {/* Form Fields */}
      <div className="grid gap-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-1">
            Vendor Name
          </label>
          <input
            type="text"
            name="vendorName"
            value={form.vendorName || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-1">
            Email (Optional)
          </label>
          <input
            type="email"
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-1">
            Shop Name
          </label>
          <input
            type="text"
            name="shopName"
            value={form.shopName || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-1">
            Shop Address (Optional)
          </label>
          <input
            type="text"
            name="shopAddress"
            value={form.shopAddress || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-1">
            Telephone Number (Optional)
          </label>
          <input
            type="text"
            name="telephoneNumber"
            value={form.telephoneNumber || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={closeModal}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg text-lg transition duration-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg text-lg shadow-lg transition duration-300"
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
