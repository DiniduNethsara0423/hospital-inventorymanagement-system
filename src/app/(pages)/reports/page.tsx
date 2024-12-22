'use client';
import React, { useState } from 'react';

const page: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      alert(`File Selected: ${event.target.files[0].name}`);
    }
  };

  // Handle click on "Create New Report" button
  const handleCreateReport = () => {
    document.getElementById('fileInput')?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-700">Hospital Reports</h1>
        <div className="flex items-center space-x-4">
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm shadow-lg hover:bg-blue-700 transition-all duration-300"
            onClick={handleCreateReport}
          >
            + Create New Report
          </button>
          <button className="bg-gray-200 p-3 rounded-lg shadow-lg hover:bg-gray-300 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.293 9.293a1 1 0 011.414 0L10 15.586l6.293-6.293a1 1 0 011.414 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search Reports"
          className="w-full max-w-md px-5 py-3 border border-gray-300 rounded-lg shadow-md focus:ring focus:ring-blue-200 focus:outline-none"
        />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {['Inventory', 'Payables', 'Payments', 'Purchases'].map((category, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-blue-600 text-3xl">
                {/* Category Icons */}
                {category === 'Inventory' && <span>📦</span>}
                {category === 'Payables' && <span>📄</span>}
                {category === 'Payments' && <span>📟</span>}
                {category === 'Purchases' && <span>🛒</span>}
              </div>
              <h2 className="text-2xl font-semibold text-blue-700">{category}</h2>
            </div>
            <ul className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <li
                  key={i}
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-all duration-300"
                >
                  <span>⭐</span>
                  <span>{category} Summary {i + 1}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* File Input (Hidden) */}
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept=".pdf,.docx,.xlsx,.csv"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default page;
