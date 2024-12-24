'use client';

import React, { useState } from 'react';

interface PDF {
  id: number;
  name: string;
  orderId: string;
  fileUrl: string;
}
import { Search, Edit, Trash2 } from "lucide-react";

const OrdersPage: React.FC = () => {
  const [pdfs, setPdfs] = useState<PDF[]>([
    { id: 1, name: 'Order-123.pdf', orderId: '123', fileUrl: '/files/Order-123.pdf' },
    { id: 2, name: 'Order-456.pdf', orderId: '456', fileUrl: '/files/Order-456.pdf' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPdf, setNewPdf] = useState({ id: 0, name: '', orderId: '', file: null });
  const [editPdf, setEditPdf] = useState<PDF | null>(null); // Track the PDF being edited

  // Filter PDFs by search term (order ID)
  const filteredPdfs = pdfs.filter((pdf) => pdf.orderId.includes(searchTerm));

  // Add PDF
  const handleAddPdf = () => {
    if (!newPdf.name || !newPdf.orderId || !newPdf.file) {
      alert('Please fill all fields to add a PDF.');
      return;
    }

    const newPdfEntry: PDF = {
      id: pdfs.length + 1,
      name: newPdf.name,
      orderId: newPdf.orderId,
      fileUrl: URL.createObjectURL(newPdf.file),
    };

    setPdfs([...pdfs, newPdfEntry]);
    setNewPdf({ id: 0, name: '', orderId: '', file: null });
  };

  // Edit PDF
  const handleEditPdf = () => {
    if (!editPdf) return;

    setPdfs(
      pdfs.map((pdf) =>
        pdf.id === editPdf.id
          ? { ...pdf, name: editPdf.name, orderId: editPdf.orderId, fileUrl: editPdf.fileUrl }
          : pdf
      )
    );
    setEditPdf(null); // Close edit form
  };

  // Delete PDF
  const handleDeletePdf = (id: number) => {
    setPdfs(pdfs.filter((pdf) => pdf.id !== id));
  };

  return (

    <div className="p-8 w-full  mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Manage Orders & PDFs</h1>
        <div className="flex items-center mt-4 sm:mt-0">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by Order ID"
              className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="table-auto w-full text-left bg-white">
          <thead className="bg-blue-100 text-gray-800 text-sm font-medium">
            <tr>
              <th className="px-6 py-3 rounded-tl-lg">PDF ID</th>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">PDF Name</th>
              <th className="px-6 py-3 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPdfs.map((pdf) => (
              <tr key={pdf.id} className="border-t hover:bg-gray-100">
                <td className="px-6 py-3 text-sm">{pdf.id}</td>
                <td className="px-6 py-3 text-sm">{pdf.orderId}</td>
                <td className="px-6 py-3 text-sm text-blue-600 hover:underline">
                  <a href={pdf.fileUrl} target="_blank" rel="noopener noreferrer">
                    {pdf.name}
                  </a>
                </td>
                <td className="px-6 py-3 flex gap-2">
                  <button
                    onClick={() => setEditPdf(pdf)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-yellow-600 bg-yellow-100 rounded-lg hover:bg-yellow-200"
                  >
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3h2m-1 0v18m4-8H8m4 4h.01M4 9h16m-2 0h.01M5 5h14" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePdf(pdf.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
                  >
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7H5m14 0H5m5 12a2 2 0 001-1.732V7m3.268 10A2 2 0 0014 17M9 7h6m-6 6h6" />
                    </svg>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New PDF */}
      <div className="mt-8 p-6 border border-gray-300 rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New PDF</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="PDF Name"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
            value={newPdf.name}
            onChange={(e) => setNewPdf({ ...newPdf, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Order ID"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
            value={newPdf.orderId}
            onChange={(e) => setNewPdf({ ...newPdf, orderId: e.target.value })}
          />
          {/* Custom File Upload */}
          <div className="relative">
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-full h-full px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg cursor-pointer hover:border-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 16v4a2 2 0 002 2H6a2 2 0 01-2-2v-4m4-4l4 4m0 0l4-4m-4 4V4"
                />
              </svg>
              Choose PDF File
            </label>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={(e) =>
                setNewPdf({
                  ...newPdf,
                  file: e.target.files ? e.target.files[0] : null,
                })
              }
            />
            {newPdf.file && (
              <p className="mt-2 text-sm text-gray-600">{newPdf.file.name}</p>
            )}
          </div>
          <button
            onClick={handleAddPdf}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Add PDF
          </button>
        </div>
      </div>

      {/* Edit PDF Popup */}
      {editPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Edit PDF</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="PDF Name"
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                value={editPdf.name}
                onChange={(e) => setEditPdf({ ...editPdf, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Order ID"
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                value={editPdf.orderId}
                onChange={(e) => setEditPdf({ ...editPdf, orderId: e.target.value })}
              />
              {/* Custom File Upload */}
              <div className="relative">
                <label
                  htmlFor="file-upload-edit"
                  className="flex items-center justify-center w-full h-full px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg cursor-pointer hover:border-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 16v4a2 2 0 002 2H6a2 2 0 01-2-2v-4m4-4l4 4m0 0l4-4m-4 4V4"
                    />
                  </svg>
                  Upload New File
                </label>
                <input
                  id="file-upload-edit"
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(e) =>
                    setEditPdf({
                      ...editPdf,
                      fileUrl: e.target.files
                        ? URL.createObjectURL(e.target.files[0])
                        : editPdf.fileUrl,
                    })
                  }
                />
                {editPdf.fileUrl && (
                  <p className="mt-2 text-sm text-gray-600">
                    {editPdf.fileUrl.split("/").pop()}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setEditPdf(null)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditPdf}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



    </div>


  );
};

export default OrdersPage;
