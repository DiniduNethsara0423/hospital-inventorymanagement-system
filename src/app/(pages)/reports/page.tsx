"use client";
import React, { useState } from "react";
import { Eye, Trash2, FileText, PlusCircle } from "lucide-react";

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
    document.getElementById("fileInput")?.click();
  };

  return (
    <div className="min-h-screen  p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Hospital Reports</h1>
        <button
          className="flex items-center bg-gray-700 text-white px-6 py-3 rounded-lg text-lg shadow-lg hover:bg-gray-800 transition-all duration-300"
          onClick={handleCreateReport}
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Create New Report
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Total Inventory Items", count: 256, icon: <FileText className="text-blue-600 w-8 h-8" />, color:"#cdddff" },
          { title: "Pending Orders", count: 78, icon: <FileText className="text-yellow-500 w-8 h-8" />, color:"#f9ffcd" },
          { title: "Completed Reports", count: 182, icon: <FileText className="text-green-600 w-8 h-8" />, color:"#cdffd0" },
        ].map((stat, index) => (
          <div
            key={index}
            className={`flex items-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-[${stat.color}]`}
          >
            <div className="mr-4">{stat.icon}</div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">{stat.title}</h2>
              <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4 mb-8">
        <input
          type="text"
          placeholder="Search Reports"
          className="w-full max-w-lg px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
        >
          <option>All Categories</option>
          <option>Inventory</option>
          <option>Payables</option>
          <option>Payments</option>
          <option>Purchases</option>
        </select>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Reports</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-700 border-b">
              <th className="py-3 px-4">Report Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Date Created</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4">Report {index + 1}</td>
                <td className="py-3 px-4">Inventory</td>
                <td className="py-3 px-4">2024-12-23</td>
                <td className="py-3 px-4 flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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