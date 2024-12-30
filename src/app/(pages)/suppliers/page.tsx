'use client';

import { useState, useEffect } from "react";
import { getVendorId, getVendors, postVendor } from "@/app/apis/supplier/api"; // Import API methods
import { Plus, Edit, Trash2, Search } from "lucide-react";

type Supplier = {
  id: string; // Use vendor_id as string
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const pageSize = 10;

  useEffect(() => {
    fetchSuppliers(currentPage, pageSize);
  }, [currentPage]);

  const fetchSuppliers = async (page: number, pageSize: number) => {
    try {
      const { data } = await getVendors(page, pageSize);
      console.log(data)
      const formattedSuppliers = data.map((vendor: any) => ({
        id: vendor.vendor_id,
        vendorName: vendor.vendor_name,
        email: vendor.email,
        shopName: vendor.shop_name,
        shopAddress: vendor.shop_address,
        telephoneNumber: vendor.telephone_number,
      }));
      setSuppliers(formattedSuppliers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      alert("Failed to fetch suppliers.");
    }
  };

  const openModal = async (supplier?: Supplier) => {
    if (supplier) {
      setForm(supplier);
      setEditingId(supplier.id);
    } else {
      try {
        // Fetch the generated vendor ID from the backend
        const  vendorId  = await getVendorId();
        setForm({ id: vendorId }); // Set the generated ID in the form state
      } catch (error) {
        console.error("Error generating vendor ID:", error);
        alert("Failed to generate vendor ID.");
        return;
      }
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
        vendor_id: form.id, // Use the ID generated earlier
        vendor_name: form.vendorName || "",
        email: form.email || "",
        shop_name: form.shopName || "",
        shop_address: form.shopAddress || "",
        telephone_number: form.telephoneNumber || "",
        created_by: 1,
      };
  
      await postVendor(newSupplier);
  
      if (editingId !== null) {
        setSuppliers((prev) =>
          prev.map((supplier) =>
            supplier.id === editingId ? { ...supplier, ...newSupplier } : supplier
          )
        );
      } else {
        setSuppliers([...suppliers, { id: newSupplier.vendor_id, ...newSupplier }]);
      }
  
      closeModal();
    } catch (error) {
      console.error("Error adding supplier:", error);
      alert(error.message || "Failed to add supplier.");
    }
  };
  

  const handleDelete = (id: string) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
  };

  return (
    <div className="mt-12 mx-3">
      {/* Page Header */}
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Supplier Management</h1>
        <p className="text-gray-600 mt-2">
          Manage your suppliers effectively by keeping their information organized. Add, edit, or remove suppliers with ease.
        </p>
      </div>

      {/* Add Supplier Button */}
      <div className="flex flex-wrap justify-between items-center mb-6">

        {/* Search Bar */}
        <div className="flex items-center w-full md:w-2/3 bg-white border border-gray-300 rounded-full shadow-sm px-4 py-2">
          <Search className="text-gray-500 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search Categories"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full focus:outline-none"
          />
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => openModal()}
            className="flex items-center space-x-2 bg-gray-700 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-blue-200 text-left">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg text-gray-800"> Vendor Name </th>
              <th className="border px-4 py-3 text-gray-800"> Email</th>
              <th className="border px-4 py-3 text-gray-800"> Shop Name </th>
              <th className="border px-4 py-3 text-gray-800"> Shop Address </th>
              <th className="border px-4 py-3 text-gray-800"> Telephone </th>
              <th className="px-4 py-3 rounded-tr-lg text-gray-800 text-center"> Actions </th>
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
                <tr key={supplier.id} className="hover:bg-blue-50">
                  <td className="border px-4 py-3 text-gray-700">{supplier.vendorName}</td>
                  <td className="border px-4 py-3 text-gray-700">{supplier.email || "-"}</td>
                  <td className="border px-4 py-3 text-gray-700">{supplier.shopName}</td>
                  <td className="border px-4 py-3 text-gray-700">{supplier.shopAddress || "-"}</td>
                  <td className="border px-4 py-3 text-gray-700">{supplier.telephoneNumber || "-"}</td>
                  <td className="border px-4 py-3 text-center">
                    <button
                      onClick={() => openModal(supplier)}
                      className="text-blue-600 mr-4 hover:text-blue-800"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
        >
          Next
        </button>
      </div>

      {/* Modal */}
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
                className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-lg text-lg shadow-lg transition duration-300"
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
