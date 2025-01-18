"use client";

import React, { useEffect, useState } from "react";
import JsBarcode from "jsbarcode"; // Barcode generation library
import { addItemToDepartment, getAssignedItems, getDepartments } from "@/app/apis/department/api";
import { getAllItemDetails, getBarcode } from "@/app/apis/inventory/api"; // Update the path as needed
import Barcode from "@/app/components/Barcode";


const AddItemToDepartment = () => {

  const [departments, setDepartments] = useState([]);
  const [assignedItems, setAssignedItems] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [itemDetails, setItemDetails] = useState([]);

  const [formData, setFormData]:any = useState({
    barcode: "",
    itemDetailId: itemDetails, // Mock ID, replace with dropdown later
    departmentId: departments, // Mock ID, replace with dropdown later
    qty: 0,
  });

  const fetchAssignedItems = async () => {
    try {
      const response = await getAssignedItems(currentPage, pageSize);
      setAssignedItems(response.result);
      console.log(response);
    } catch (error) {
      console.error("Error fetching assigned items:", error);
      alert("Failed to fetch assigned items.");
    }
  };

  const fetchAllItemDetails = async () => {
    try {
      let page = 1;
      const pageSize = 10;
      let allItemDetails: any = [];
      let response;

      do {
        response = await getAllItemDetails(page, pageSize);
        allItemDetails = [...allItemDetails, ...response.results];
        page++;
      } while (response.totalCount === pageSize);

      setItemDetails(allItemDetails);
    } catch (error) {
      console.error("Error fetching item details:", error);
      alert("Failed to fetch item details.");
    }
  };

  const fetchAllDepartments = async () => {
    try {
      let page = 1;
      const pageSize = 10;
      let allDepartments: any = [];
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

  // Fetch a new barcode from the backend
  const handleGenerateBarcode = async () => {
    try {
      const response = await getBarcode();
      setFormData({ ...formData, barcode: String(response.data) });
    } catch (error) {
      console.error("Error fetching barcode:", error);
      alert("Failed to fetch barcode.");
    }
  };

  // Render barcodes dynamically
  const generateBarcodeSVG = (id: string, barcode: string) => {
    useEffect(() => {
      if (barcode) {
        JsBarcode(`#barcode-${id}`, barcode, {
          format: "CODE128",
          lineColor: "#000",
          width: 2,
          height: 50,
          displayValue: false,
        });
      }
    }, [barcode]);
    return <svg id={`barcode-${id}`} />;
  };

  useEffect(() => {
    fetchAllDepartments();
    fetchAllItemDetails();
  }, []);

  useEffect(() => {
    fetchAssignedItems();
  }, [currentPage, pageSize]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to ${value}`); // Debugging
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    console.log("Submitting formData:", formData); // Debugging
  
    try {
      await addItemToDepartment(
        formData.barcode,
        Number(formData.itemDetailId),
        Number(formData.departmentId),
        Number(formData.qty)
      );
      alert("Item successfully added to department!");
      setFormData({
        barcode: "",
        itemDetailId: 1,
        departmentId: 1,
        qty: 0,
      });
      fetchAssignedItems(); // Refresh table data
    } catch (error) {
      alert("Failed to add item to department. Please try again.");
    }
  };
  
  const handlePageChange = (page: any) => {
    setCurrentPage(page);
    fetchAssignedItems();
  };

  const handlePageSizeChange = (e: any) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
    fetchAssignedItems();
  };

  return (
    <div className="w-full h-screen flex flex-col p-6">
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
        <div className="w-full p-8 bg-white rounded-lg border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Barcode and Item Detail ID */}
            <div className="grid grid-cols-2 gap-4">
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
                  className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
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
                  <option value="" disabled>
                    Select an item
                  </option>
                  {itemDetails.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.id}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            {/* Department and Quantity */}
            <div className="grid grid-cols-2 gap-4">
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
                  {departments.map((dept: any) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
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

      {/* Table Section */}
      <div className="py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-700">Assigned Items</h2>
          {/* Page Size Selector */}
          <div className="overflow-x-auto rounded-lg border-gray-300">
            <label htmlFor="pageSize" className="mr-2 text-sm font-medium text-gray-700">
              Items per page:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
        <div>
          <table className="table-auto w-full text-left bg-white">
            <thead className="bg-blue-100 text-gray-800 text-sm font-medium">
              <tr>
                <th className="px-6 py-3 rounded-tl-lg">Barcode</th>
                <th className="px-6 py-3">Generated Barcode</th>
                <th className="px-6 py-3">Item</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3 rounded-tr-lg">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {assignedItems.map((item: any) => (
                <tr key={item.ITEM_DEPARTMENT_BARCODE} className="border-t hover:bg-gray-100">
                  <td className="px-6 py-3">{item.ITEM_DEPARTMENT_BARCODE}</td>
                  <Barcode barcode={item.ITEM_DEPARTMENT_BARCODE} />
                  <td className="px-6 py-3">{item.ITEM_NAME}</td>
                  <td className="px-6 py-3">{item.DEPARTMENT_NAME}</td>
                  <td className="px-6 py-3">{item.QTY}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-900 focus:outline-none ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          Previous
        </button>
        <span className="text-sm font-medium text-gray-700">
          Page {currentPage}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-900 focus:outline-none"
        >
          Next
        </button>
      </div>
    </div>

  );
};

export default AddItemToDepartment;
