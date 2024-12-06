'use client';
import React, { useState } from "react";

interface Vendor {
  name: string;
  email?: string;
  shopName: string;
  shopAddress?: string;
  telephoneNumber?: string;
}

const VendorForm: React.FC = () => {
  const [vendor, setVendor] = useState<Vendor>({
    name: "",
    email: "",
    shopName: "",
    shopAddress: "",
    telephoneNumber: "",
  });

  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVendor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!vendor.name || !vendor.shopName) {
      setError("Name and Shop Name are required.");
      return;
    }
    setError("");
    // Process form submission logic here (e.g., save to server or update state)
    console.log("Vendor submitted:", vendor);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Vendor Registration</h1>

      <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
              Vendor Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={vendor.name}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={vendor.email || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="shopName" className="block text-sm font-semibold text-gray-700">
              Shop Name
            </label>
            <input
              type="text"
              id="shopName"
              name="shopName"
              value={vendor.shopName}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="shopAddress" className="block text-sm font-semibold text-gray-700">
              Shop Address (Optional)
            </label>
            <input
              type="text"
              id="shopAddress"
              name="shopAddress"
              value={vendor.shopAddress || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="telephoneNumber" className="block text-sm font-semibold text-gray-700">
              Telephone Number (Optional)
            </label>
            <input
              type="text"
              id="telephoneNumber"
              name="telephoneNumber"
              value={vendor.telephoneNumber || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
            <button
              type="reset"
              onClick={() => setVendor({
                name: "",
                email: "",
                shopName: "",
                shopAddress: "",
                telephoneNumber: "",
              })}
              className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorForm;
