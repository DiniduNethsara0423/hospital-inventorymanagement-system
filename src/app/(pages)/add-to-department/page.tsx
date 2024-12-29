"use client";

import React, { useEffect, useState } from "react";
import { addItemToDepartment } from "@/app/apis/department/api";
import { getDepartments } from "@/app/apis/department/api";

const AddItemToDepartment = () => {
  const generateBarcode = () => {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate()
    ).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(
      now.getMinutes()
    ).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
  };

  const [formData, setFormData] = useState({
    barcode: generateBarcode(),
    itemDetailId: 1, // Mock ID, replace with dropdown later
    departmentId: 1, // Mock ID, replace with dropdown later
    qty: 0,
  });

  const [departments, setDepartments] = useState([]);

  const fetchAllDepartments = async () => {
    try {
      let page = 1;
      const pageSize = 10;
      let allDepartments:any = [];
      let response;

      do {
        response = await getDepartments(page, pageSize);
        allDepartments = [...allDepartments, ...response.data];
        page++;
      } while (response.data.length === pageSize);

      setDepartments(allDepartments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      alert("Failed to fetch departments.");
    }
  };

  useEffect(() => {
    fetchAllDepartments();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerateBarcode = () => {
    setFormData({ ...formData, barcode: generateBarcode() });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await addItemToDepartment(
        formData.barcode,
        Number(formData.itemDetailId),
        Number(formData.departmentId),
        Number(formData.qty)
      );
      alert("Item successfully added to department!");
      setFormData({
        barcode: generateBarcode(),
        itemDetailId: 1,
        departmentId: 1,
        qty: 0,
      });
    } catch (error) {
      alert("Failed to add item to department. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Page Title */}
      <div className="py-6">
        <h1 className="text-center text-3xl font-bold text-gray-700">
          Add Items to Department
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Use this form to assign items to specific departments in the inventory system.
        </p>
      </div>

      {/* Form Section */}
      <main className="flex-1 flex justify-center">
        <div className="max-w-4xl w-full p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Barcode */}
            <div>
              <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">
                Barcode
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  id="barcode"
                  name="barcode"
                  type="text"
                  value={formData.barcode}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
                <button
                  type="button"
                  onClick={handleGenerateBarcode}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-900 focus:outline-none"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Item Detail ID */}
            <div>
              <label htmlFor="itemDetailId" className="block text-sm font-medium text-gray-700">
                Item Detail ID
              </label>
              <select
                id="itemDetailId"
                name="itemDetailId"
                value={formData.itemDetailId}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value={1}>Mock Item 1</option>
                <option value={2}>Mock Item 2</option>
              </select>
            </div>

            {/* Department ID */}
            <div>
              <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                id="departmentId"
                name="departmentId"
                value={formData.departmentId}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              >
                {departments.map((dept:any) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="qty" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                id="qty"
                name="qty"
                type="number"
                value={formData.qty}
                onChange={handleInputChange}
                placeholder="Enter quantity"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gray-800 text-white text-lg font-medium rounded-md shadow hover:bg-gray-900 focus:outline-none"
            >
              Add Item
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddItemToDepartment;
