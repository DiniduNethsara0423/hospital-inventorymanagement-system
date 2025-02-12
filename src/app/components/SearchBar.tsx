'use client';
import React, { useState } from 'react';
import { LucideSearch, X } from 'lucide-react';
import { fetchItemByBarcode } from '@/app/apis/add-items/api';

const SearchBar = () => {
  const [searchQuery, setSearchQuery]:any = useState('');
  const [itemDetails, setItemDetails]:any = useState(null);
  const [error, setError]:any = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a barcode or a name of a item.');
      return;
    }

    try {
      setError('');
      const item = await fetchItemByBarcode(searchQuery);
      setItemDetails(item);
      setIsModalOpen(true); // Open the modal with the item details
    } catch (err:any) {
      setItemDetails(null);
      setError(err.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setItemDetails(null);
  };

  return (
    <div className="relative w-1/2 md:w-1/3 ml-64">
      <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 shadow-sm">
  <input
    type="text"
    className="w-full px-4 py-2 text-gray-900 bg-transparent focus:outline-none dark:text-white"
    placeholder="Search items... name / barcode"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  <button
    onClick={handleSearch}
    className="px-4 py-2  text-gray-900 rounded-r-lg  focus:outline-none"
  >
    <LucideSearch className="w-5 h-5" />
  </button>
</div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {isModalOpen && itemDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-11/12 max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Item Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600 dark:text-gray-400">Item Name:</span>
                <span className="text-gray-800 dark:text-gray-200">{itemDetails.item_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600 dark:text-gray-400">Barcode:</span>
                <span className="text-gray-800 dark:text-gray-200">{itemDetails.item_barcode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600 dark:text-gray-400">Category:</span>
                <span className="text-gray-800 dark:text-gray-200">{itemDetails.category_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600 dark:text-gray-400">Available Qty:</span>
                <span className="text-gray-800 dark:text-gray-200">{itemDetails.avalible_qty}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600 dark:text-gray-400">Currently Using Qty:</span>
                <span className="text-gray-800 dark:text-gray-200">{itemDetails.currently_using_qty}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600 dark:text-gray-400">Total Qty:</span>
                <span className="text-gray-800 dark:text-gray-200">{itemDetails.qty}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600 dark:text-gray-400">Lower Quantity:</span>
                <span className="text-gray-800 dark:text-gray-200">{itemDetails.lower_quantity}</span>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;