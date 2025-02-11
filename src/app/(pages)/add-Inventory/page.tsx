"use client";

import React, { useState, useEffect } from "react";
import { getAllCategories, getSuggestions, addNewItem, getInvoiceSuggestions } from "@/app/apis/inventory/api";
import Barcode from "react-barcode";
import { useRouter } from "next/navigation";

const AddItemForm = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData]: any = useState({
    category_id: "",
    name: "",
    barcode: "",
    total_qty: "",
    lower_quantity: "",
    price: "",
    invoice_id: "",
    // vendor_id: "", // New field added
  });
  const [suggestions, setSuggestions] = useState([]);
  const [isExistingItem, setIsExistingItem] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  
  const router = useRouter();

  const [invoiceSuggestions, setInvoiceSuggestions] = useState<string[]>([]);

  const handleInvoiceInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    if (value.length > 2) {  // Fetch suggestions when input is meaningful
      try {
        const suggestionsData = await getInvoiceSuggestions(value);
        setInvoiceSuggestions(suggestionsData);
      } catch (error) {
        console.error("Failed to fetch invoice suggestions:", error);
      }
    } else {
      setInvoiceSuggestions([]);
    }
  };

  const handleInvoiceSuggestionSelect = (selectedInvoice: string) => {
    setFormData({ ...formData, invoice_id: selectedInvoice });
    setInvoiceSuggestions([]);
  };


  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({ ...formData, name });

    if (name.length >= 2 && formData.category_id) {
      try {
        const suggestionsData = await getSuggestions(name, Number(formData.category_id));
        setSuggestions(suggestionsData || []);
        setIsExistingItem(suggestionsData.length > 0);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (suggestion: any) => {
    setFormData({
      ...formData,
      name: suggestion.name,
      barcode: suggestion.barcode,
    });
    setSuggestions([]); // Clear suggestions after selection
    setIsExistingItem(true); // Mark as existing item
  };

  const handleGenerateBarcode = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const generatedBarcode = `${year}${month}${day}${hours}${minutes}${seconds}`;
    setFormData({ ...formData, barcode: generatedBarcode });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { category_id, name, barcode, total_qty, lower_quantity, price, invoice_id } = formData;

    if (!category_id || !name || !barcode || !total_qty || !lower_quantity || !price || !invoice_id) {
      setModalMessage("Please fill in all required fields.");
      setIsModalOpen(true);
      return;
    }

    try {
      await addNewItem({
        ...formData,
        category_id: Number(category_id),
        total_qty: Number(total_qty),
        lower_quantity: Number(lower_quantity),
        price: parseFloat(price),
      });
      setModalMessage("Item added successfully!");
  setIsModalOpen(true);
      setFormData({
        category_id: "",
        name: "",
        barcode: "",
        total_qty: "",
        lower_quantity: "",
        price: "",
        invoice_id: invoice_id,
        // vendor_id: "",
      });
      setSuggestions([]);
      setIsExistingItem(false);
    } catch (error) {
      setModalMessage("Failed to add item. Please try again.");
  setIsModalOpen(true);
    }
  };

  return (
    <div className="p-10 bg-white rounded-md">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Add New Item</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div className="flex flex-col">
          <label htmlFor="category_id" className="text-md font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-gray-500"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div className="flex flex-col">
          <label htmlFor="name" className="text-md font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Enter item name"
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-gray-500"
          />
          {suggestions.length > 0 && (
            <ul className="bg-white border border-gray-300 rounded-lg mt-2 max-h-40 overflow-y-auto shadow-md">
              {suggestions?.map((suggestion: any, index: number) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="p-2 hover:bg-blue-50 cursor-pointer flex justify-between"
                >
                  <span>{suggestion.name}</span>
                  <span className="text-gray-500">{suggestion.barcode}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Barcode */}
        <div className="flex flex-col">
          <label htmlFor="barcode" className="text-md font-medium text-gray-700 mb-1">
            Barcode
          </label>
          <div className="flex gap-2">
            <input
              id="barcode"
              type="text"
              value={formData.barcode}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-gray-500"
              disabled={isExistingItem}
            />
            <button
              type="button"
              onClick={handleGenerateBarcode}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-900 focus:outline-none"
              disabled={isExistingItem}
            >
              Generate
            </button>
          </div>
          {formData.barcode && (
            <div className="mt-4">
              <Barcode value={formData.barcode} />
            </div>
          )}
        </div>

        {/* Other Fields */}
        {[
          // { id: "vendor_id", label: "Vendor ID" }, // Added vendor_id field
          { id: "total_qty", label: "Total Quantity" },
          { id: "lower_quantity", label: "Lower Quantity" },
          { id: "price", label: "Price" },
          // { id: "invoice_id", label: "Invoice ID" },
        ].map((field) => (
          <div key={field.id} className="flex flex-col">
            <label htmlFor={field.id} className="text-md font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              id={field.id}
              type="text"
              value={formData[field.id]}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-gray-500"
            />
          </div>
        ))}

        <div className="relative">
        <label className="text-md font-medium text-gray-700 mb-1">Invoice ID</label>
          <input
            id="invoice_id"
            type="text"
            value={formData.invoice_id}
            onChange={handleInvoiceInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-gray-500"
          />
          {invoiceSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
              {invoiceSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleInvoiceSuggestionSelect(suggestion)}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-gray-800 text-white text-lg rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring focus:ring-gray-600"
        >
          Add Item
        </button>
      </form>

      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-md shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Message</h2>
      <p>{modalMessage}</p>
      <button
        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg"
        onClick={() => setIsModalOpen(false)}
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default AddItemForm;
