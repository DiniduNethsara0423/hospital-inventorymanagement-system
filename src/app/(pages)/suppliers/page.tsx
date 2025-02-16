'use client';

import { useState, useEffect } from "react";
import { deleteVendor, getVendorId, getVendors, postVendor, updateVendor } from "@/app/apis/supplier/api"; // Import API methods
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useRouter } from "next/navigation";

type Supplier = {
  id: string; // Use vendor_id as string
  vendorName: string;
  email?: string;
  shopName: string;
  shopAddress?: string;
  telephoneNumber?: string;
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers]: any = useState<Supplier[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<Supplier>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const router = useRouter();

  const [emailError, setEmailError] = useState<string | null>(null);

const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const pageSize = 10;

  useEffect(() => {
    fetchSuppliers(currentPage, pageSize);
  }, [currentPage]);

  const [fetchError, setFetchError] = useState<string | null>(null); // Add this line

  const fetchSuppliers = async (page: number, pageSize: number) => {
    try {
      const { data } = await getVendors(page, pageSize);
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
      setFetchError("Failed to fetch suppliers.");
    }
  };


  const openModal = async (supplier?: Supplier) => {
    if (supplier) {
      setForm(supplier);
      setEditingId(supplier.id);
      setIsModalOpen(true);
    } else {
      setEditingId(null);
      setForm({}); // Clear form initially
      setIsModalOpen(true);

      try {
        const vendorId = await getVendorId();
        setForm((prevForm) => ({ ...prevForm, id: vendorId }));
      } catch (error) {
        console.error("Error generating vendor ID:", error);
        alert("Failed to generate vendor ID.");
      }
    }
  };



  const closeModal = () => {
    setIsModalOpen(false);
    setForm({});
    setEditingId(null);
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
    
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  
    if (name === "email") {
      if (value && !validateEmail(value)) {
        setEmailError("Invalid email format");
      } else {
        setEmailError(null);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const supplierData: any = {
        vendor_id: form.id, // Use the ID
        vendor_name: form.vendorName || "",
        email: form.email || "",
        shop_name: form.shopName || "",
        shop_address: form.shopAddress || "",
        telephone_number: form.telephoneNumber || "",
      };

      if (editingId) {
        // Update existing supplier
        await updateVendor(editingId, supplierData);
        setSuppliers((prev: any) =>
          prev.map((supplier: any) =>
            supplier.id === editingId ? { ...supplier, ...supplierData } : supplier
          )
        );
      } else {
        // Add new supplier
        await postVendor(supplierData);
        setSuppliers([...suppliers, { id: supplierData.vendor_id, ...supplierData }]);
      }

      closeModal();
      fetchSuppliers(currentPage, pageSize)
    } catch (error: any) {
      console.error("Error saving supplier:", error);
      alert(error.message || "Failed to save supplier.");
    }
  };



  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null); // Add this line

  const handleDelete = (id: string) => {
    setDeleteConfirmation(id); // Instead of directly deleting, ask for confirmation
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      await deleteVendor(deleteConfirmation);
      setSuppliers(suppliers.filter((supplier: any) => supplier.id !== deleteConfirmation));
    } catch (error) {
      console.error("Error deleting supplier:", error);
    } finally {
      setDeleteConfirmation(null);
    }
  };

  // Ensure properties are defined before calling toLowerCase()
  const filteredSuppliers = suppliers?.filter((supplier: any) => {
    const query = (searchQuery || "").toLowerCase();
    return (
      (supplier.vendorName && supplier.vendorName.toLowerCase().includes(query)) ||
      (supplier.email && supplier.email.toLowerCase().includes(query)) ||
      (supplier.shopName && supplier.shopName.toLowerCase().includes(query)) ||
      (supplier.telephoneNumber && supplier.telephoneNumber.toLowerCase().includes(query))
    );
  });



  return (
    <div className="mt-12 mx-6">
      {/* Page Header */}
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Supplier Management</h1>
        <p className="text-gray-600 mt-2">
          Manage your suppliers effectively by keeping their information organized. Add, edit, or remove suppliers with ease.
        </p>
      </div>

      {/* Add Supplier Button */}
      <div className="flex flex-col lg:flex-row lg:justify-between md:items-center mb-6 space-y-4 lg:space-y-0">
  {/* Search Bar */}
  <div className="flex items-center w-full lg:w-2/3 bg-white border border-gray-300 rounded-full shadow-sm px-4 py-2">
    <Search className="text-gray-500 w-5 h-5 mr-2" />
    <input
      type="text"
      placeholder="Search Categories"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full focus:outline-none"
    />
  </div>

  {/* Add Supplier Button */}
  <div className="flex justify-center lg:justify-end">
    <button
      onClick={() => openModal()}
      className="flex items-center space-x-2 bg-gray-700 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition"
    >
      <Plus className="w-5 h-5" />
      <span>Add Supplier</span>
    </button>
  </div>
</div>


      {/* Card View for md and below */}
      <div className="grid gap-4  lg:hidden">
        {filteredSuppliers.length === 0 ? (
          <p className="text-center py-6 text-gray-500 text-sm bg-gray-50">No suppliers match your search.</p>
        ) : (
          filteredSuppliers.map((supplier: any) => (
            <div key={supplier.id} className="border p-4 rounded-lg shadow bg-white">
              <p><strong>Vendor ID:</strong> {supplier.id}</p>
              <p><strong>Name:</strong> {supplier.vendorName}</p>
              <p><strong>Email:</strong> {supplier.email || "-"}</p>
              <p><strong>Shop:</strong> {supplier.shopName}</p>
              <p><strong>Address:</strong> {supplier.shopAddress || "-"}</p>
              <p><strong>Phone:</strong> {supplier.telephoneNumber || "-"}</p>
              <div className="mt-4 flex justify-end space-x-4">
                <button onClick={() => openModal(supplier)} className="text-blue-600 hover:text-blue-800">
                  <Edit size={20} />
                </button>
                <button onClick={() => handleDelete(supplier.id)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Table View for lg and above */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-lg">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-blue-200 text-left">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg text-gray-800">Vendor ID</th>
              <th className="px-4 py-3 border text-gray-800">Vendor Name</th>
              <th className="border px-4 py-3 text-gray-800">Email</th>
              <th className="border px-4 py-3 text-gray-800">Shop Name</th>
              <th className="border px-4 py-3 text-gray-800">Shop Address</th>
              <th className="border px-4 py-3 text-gray-800">Telephone</th>
              <th className="px-4 py-3 rounded-tr-lg text-gray-800 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500 text-sm bg-gray-50">
                  No suppliers match your search.
                </td>
              </tr>
            ) : (
              filteredSuppliers.map((supplier: any) => (
                <tr key={supplier.id} className="hover:bg-blue-50">
                  <td className="border px-4 py-3 text-gray-700">{supplier.id}</td>
                  <td className="border px-4 py-3 text-gray-700">{supplier.vendorName}</td>
                  <td className="border px-4 py-3 text-gray-700">{supplier.email || "-"}</td>
                  <td className="border px-4 py-3 text-gray-700">{supplier.shopName}</td>
                  <td className="border px-4 py-3 text-gray-700">{supplier.shopAddress || "-"}</td>
                  <td className="border px-4 py-3 text-gray-700">{supplier.telephoneNumber || "-"}</td>
                  <td className="border px-4 py-3 text-center">
                    <button onClick={() => openModal(supplier)} className="text-blue-600 mr-4 hover:text-blue-800">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => handleDelete(supplier.id)} className="text-red-600 hover:text-red-800">
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
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex justify-center items-center z-50 ">
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
    className={`w-full px-4 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg`}
  />
  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
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

      {fetchError && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{fetchError}</p>
            <button
              onClick={() => setFetchError(null)}
              className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this supplier?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
