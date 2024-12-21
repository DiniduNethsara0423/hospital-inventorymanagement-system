'use client';

import { useState, useEffect } from "react";
import { postSupplier } from "@/app/apis/supplier/api";

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
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                Vendor Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                Shop Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                Shop Address
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                Telephone
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-4 text-gray-500 text-sm"
                >
                  No suppliers added yet.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr key={supplier.id} className="bg-white">
                  <td className="border border-gray-300 px-4 py-2">
                    {supplier.vendorName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {supplier.email || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {supplier.shopName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {supplier.shopAddress || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {supplier.telephoneNumber || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => openModal(supplier)}
                      className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal for Add/Edit Supplier */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Supplier" : "Add Supplier"}
            </h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Vendor Name
                </label>
                <input
                  type="text"
                  name="vendorName"
                  value={form.vendorName || ""}
                  onChange={handleChange}
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Shop Name
                </label>
                <input
                  type="text"
                  name="shopName"
                  value={form.shopName || ""}
                  onChange={handleChange}
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Shop Address (Optional)
                </label>
                <input
                  type="text"
                  name="shopAddress"
                  value={form.shopAddress || ""}
                  onChange={handleChange}
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Telephone Number (Optional)
                </label>
                <input
                  type="text"
                  name="telephoneNumber"
                  value={form.telephoneNumber || ""}
                  onChange={handleChange}
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
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
