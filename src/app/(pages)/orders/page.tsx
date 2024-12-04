'use client';

import React, { useState } from 'react';

interface PDF {
  id: number;
  name: string;
  orderId: string;
  fileUrl: string;
}

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
    <div className="p-6 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <input
          type="text"
          placeholder="Search by Order ID"
          className="border border-gray-300 rounded-md px-4 py-2 w-60"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* PDF List */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="border border-gray-200 px-4 py-2">PDF ID</th>
              <th className="border border-gray-200 px-4 py-2">Order ID</th>
              <th className="border border-gray-200 px-4 py-2">PDF Name</th>
              <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPdfs.map((pdf) => (
              <tr key={pdf.id} className="hover:bg-gray-100">
                <td className="border border-gray-200 px-4 py-2">{pdf.id}</td>
                <td className="border border-gray-200 px-4 py-2">{pdf.orderId}</td>
                <td className="border border-gray-200 px-4 py-2">
                  <a
                    href={pdf.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {pdf.name}
                  </a>
                </td>
                <td className="border border-gray-200 px-4 py-2 space-x-2">
                  <button
                    onClick={() => setEditPdf(pdf)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePdf(pdf.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New PDF */}
      <div className="mt-6 p-4 border border-gray-300 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Add New PDF</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="PDF Name"
            className="border border-gray-300 rounded-md px-4 py-2"
            value={newPdf.name}
            onChange={(e) => setNewPdf({ ...newPdf, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Order ID"
            className="border border-gray-300 rounded-md px-4 py-2"
            value={newPdf.orderId}
            onChange={(e) => setNewPdf({ ...newPdf, orderId: e.target.value })}
          />
          <input
            type="file"
            accept="application/pdf"
            className="border border-gray-300 rounded-md px-4 py-2"
            onChange={(e) =>
              setNewPdf({ ...newPdf, file: e.target.files ? e.target.files[0] : null })
            }
          />
          <button
            onClick={handleAddPdf}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add PDF
          </button>
        </div>
      </div>

      {/* Edit PDF Form */}
      {editPdf && (
        <div className="mt-6 p-4 border border-gray-300 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Edit PDF</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="PDF Name"
              className="border border-gray-300 rounded-md px-4 py-2"
              value={editPdf.name}
              onChange={(e) => setEditPdf({ ...editPdf, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Order ID"
              className="border border-gray-300 rounded-md px-4 py-2"
              value={editPdf.orderId}
              onChange={(e) => setEditPdf({ ...editPdf, orderId: e.target.value })}
            />
            <input
              type="file"
              accept="application/pdf"
              className="border border-gray-300 rounded-md px-4 py-2"
              onChange={(e) =>
                setEditPdf({
                  ...editPdf,
                  fileUrl: e.target.files ? URL.createObjectURL(e.target.files[0]) : editPdf.fileUrl,
                })
              }
            />
            <button
              onClick={handleEditPdf}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
