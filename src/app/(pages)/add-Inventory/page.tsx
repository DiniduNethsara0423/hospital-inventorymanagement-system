"use client";

import React, { useState, useEffect } from "react";
import { getAllCategories, getSuggestions, addNewItem } from "@/app/apis/inventory/api";

const AddItemForm = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    barcode: "",
    total_qty: "",
    lower_quantity: "",
    price: "",
    invoice_id: "",
    created_by: 160000
  });
  const [suggestions, setSuggestions] = useState([]);
  const [isExistingItem, setIsExistingItem] = useState(false);

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
    const generatedBarcode = `BC${Date.now()}`;
    setFormData({ ...formData, barcode: generatedBarcode });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { category_id, name, barcode, total_qty, lower_quantity, price, invoice_id } = formData;

    if (!category_id || !name || !barcode || !total_qty || !lower_quantity || !price || !invoice_id) {
      alert("Please fill in all required fields.");
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
      alert("Item added successfully!");
      setFormData({
        category_id: "",
        name: "",
        barcode: "",
        total_qty: "",
        lower_quantity: "",
        price: "",
        invoice_id: "",
      });
      setSuggestions([]);
      setIsExistingItem(false);
    } catch (error) {
      alert("Failed to add item. Please try again.");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className="block w-full border-gray-300 rounded-md shadow-sm"
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
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Item Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Enter item name"
            className="block w-full border-gray-300 rounded-md shadow-sm"
          />
          {suggestions.length > 0 && (
            <ul className="bg-white border border-gray-300 rounded-md mt-2 max-h-40 overflow-y-auto">
              {suggestions.map((suggestion: any, index: number) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                >
                  <span>{suggestion.name}</span>
                  <span className="text-gray-500">{suggestion.barcode}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Barcode */}
        <div>
          <label htmlFor="barcode" className="block text-sm font-medium">
            Barcode
          </label>
          <div className="flex gap-2">
            <input
              id="barcode"
              type="text"
              value={formData.barcode}
              onChange={handleInputChange}
              className="block w-full border-gray-300 rounded-md shadow-sm"
              disabled={isExistingItem}
            />
            <button
              type="button"
              onClick={handleGenerateBarcode}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={isExistingItem}
            >
              Generate
            </button>
          </div>
        </div>

        {/* Other Fields */}
        {["total_qty", "lower_quantity", "price", "invoice_id"].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm font-medium capitalize">
              {field.replace("_", " ")}
            </label>
            <input
              id={field}
              type={field === "price" ? "number" : "text"}
              value={formData[field]}
              onChange={handleInputChange}
              className="block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;
