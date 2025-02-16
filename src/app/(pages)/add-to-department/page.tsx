"use client";

import React, { useEffect, useState } from "react";
import JsBarcode from "jsbarcode"; // Barcode generation library
import { addItemToDepartment, getAssignedItems, getDepartments, getItemsForDepartmentAddition } from "@/app/apis/department/api";
import { getAllItemDetails, getBarcode } from "@/app/apis/inventory/api"; // Update the path as needed
import Barcode from "@/app/components/Barcode";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/Modal";


const AddItemToDepartment = () => {

  const [departments, setDepartments] = useState([]);
  const [assignedItems, setAssignedItems] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [itemDetails, setItemDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedItems, setSuggestedItems] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    barcode: "",
    itemDetailId: "", // Default should be an empty string or a valid single value
    departmentId: "", // Same here
    qty: 0,
  });


  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const [modalOpen, setModalOpen] = useState(false);
const [modalMessage, setModalMessage] = useState("");

const [modalType, setModalType] = useState<"success" | "error">("success");

const showModal = (message: string) => {
  setModalMessage(message);
  setModalOpen(true);
};

const closeModal = () => {
  setModalOpen(false);
};
  const fetchAssignedItems = async () => {
    try {
      const response = await getAssignedItems(currentPage, pageSize);
      setAssignedItems(response.result);
    } catch (error) {
      showModal("Failed to fetch assigned items.");
      setModalType("error");

    }
  };

  const fetchSuggestedItems = async (query: string) => {
    if (!query) {
      setSuggestedItems([]);
      return;
    }

    try {
      const response = await getItemsForDepartmentAddition(query, query); // Use either iName or barcode
      setSuggestedItems(response || []);
    } catch (error) {
      console.error("Failed to fetch item suggestions", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchSuggestedItems(value); // Call API while typing
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
      showModal("Failed to fetch item details.");
      setModalType("error");

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
      showModal("Failed to fetch departments.");
      setModalType("error");

    }
  };

  // Fetch a new barcode from the backend
  const handleGenerateBarcode = async () => {
    try {
      const response = await getBarcode();
      setFormData({ ...formData, barcode: String(response.data) });
    } catch (error) {
      showModal("Failed to fetch barcode.");
      setModalType("error");

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
    setFormData({ ...formData, [name]: value });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await addItemToDepartment(
        formData.barcode,
        Number(formData.itemDetailId),
        Number(formData.departmentId),
        Number(formData.qty)
      );
      setIsModalOpen(true); // Open modal on success
      setFormData({
        barcode: "",
        itemDetailId: "",
        departmentId: "",
        qty: 0,
      });
      fetchAssignedItems(); // Refresh table data
    } catch (error) {
      showModal("Failed to add item to department. Please try again.");
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
      <main className="flex-1 flex justify-center ">
        <div className="w-full max-w-3xl p-3 bg-white rounded-lg border shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Barcode and Item Detail ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className=" relative">
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
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
              <div className="relative">
                <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700">
                  Search Item (Name or Barcode)
                </label>
                <input
                  type="text"
                  id="searchQuery"
                  name="searchQuery"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Type item name or barcode..."
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
                {/* Suggestions Dropdown */}
                {suggestedItems.length > 0 && (
                  <ul className="absolute left-0 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto z-10">
                    {suggestedItems.length > 0 ? (
                      suggestedItems.map((item) => (
                        <li
                          key={item.ITEM_DETAIL_ID}
                          className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              itemDetailId: item.ITEM_DETAIL_ID,
                            });
                            setSearchQuery(item.ITEM_NAME);
                            setSuggestedItems([]);
                          }}
                        >
                          {item.ITEM_NAME} - {item.ITEM_BARCODE}
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-2 text-gray-500">No items found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* Department and Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="" disabled>Select a department</option>
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
  {/* Header & Page Size Selector */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
    <h2 className="text-xl font-bold text-gray-700">Assigned Items</h2>
    <div className="flex items-center">
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

  {/* Table Layout for Large Screens */}
  <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md border">
    <table className="min-w-full table-auto text-left">
      <thead className="bg-blue-100 text-gray-800 text-sm font-medium">
        <tr>
          <th className="px-4 py-3 rounded-tl-lg">Barcode</th>
          <th className="px-4 py-3">Generated Barcode</th>
          <th className="px-4 py-3">Item</th>
          <th className="px-4 py-3">Department</th>
          <th className="px-4 py-3 rounded-tr-lg">Quantity</th>
        </tr>
      </thead>
      <tbody>
        {assignedItems.map((item: any) => (
          <tr key={item.ITEM_DEPARTMENT_BARCODE} className="border-t hover:bg-gray-100">
            <td className="px-4 py-3">{item.ITEM_DEPARTMENT_BARCODE}</td>
            <td className="px-4 py-3">
              <Barcode barcode={item.ITEM_DEPARTMENT_BARCODE} />
            </td>
            <td className="px-4 py-3">{item.ITEM_NAME}</td>
            <td className="px-4 py-3">{item.DEPARTMENT_NAME}</td>
            <td className="px-4 py-3">{item.QTY}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Card Layout for Small Screens */}
  <div className="md:hidden space-y-4">
    {assignedItems.map((item: any) => (
      <div key={item.ITEM_DEPARTMENT_BARCODE} className="bg-white p-4 rounded-lg shadow-md border">
        <p className="text-sm font-medium text-gray-700">
          <span className="font-semibold">Barcode:</span> {item.ITEM_DEPARTMENT_BARCODE}
        </p>
        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="font-semibold">Generated Barcode:</span> <Barcode barcode={item.ITEM_DEPARTMENT_BARCODE} />
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-semibold">Item:</span> {item.ITEM_NAME}
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-semibold">Department:</span> {item.DEPARTMENT_NAME}
        </p>
        <p className="text-sm font-medium text-gray-700">
          <span className="font-semibold">Quantity:</span> {item.QTY}
        </p>
      </div>
    ))}
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700">Success</h2>
            <p className="mt-2 text-gray-600">Item successfully added to department!</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 text-gray-800  rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
<Modal isOpen={modalOpen} onClose={closeModal} message={modalMessage}   type={modalType} />

    </div>

  );
};

export default AddItemToDepartment;
