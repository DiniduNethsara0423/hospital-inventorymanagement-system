'use client';
import React, { useState } from "react";

interface Quotation {
  id: number;
  name: string;
  description: string;
  fullPrice: number;
  approved: boolean;
}

const PurchaseOrders: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newFullPrice, setNewFullPrice] = useState<number | "">("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddQuotation = () => {
    if (newName.trim() === "" || newDescription.trim() === "" || newFullPrice === "")
      return;
    setQuotations([
      ...quotations,
      {
        id: Date.now(),
        name: newName,
        description: newDescription,
        fullPrice: Number(newFullPrice),
        approved: false,
      },
    ]);
    setNewName("");
    setNewDescription("");
    setNewFullPrice("");
  };

  const handleDeleteQuotation = (id: number) => {
    setQuotations(quotations.filter((q) => q.id !== id));
  };

  const handleApproveQuotation = (id: number) => {
    setQuotations(
      quotations.map((q) =>
        q.id === id ? { ...q, approved: !q.approved } : q
      )
    );
  };

  const handleOpenModal = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
  };

  const handleCloseModal = () => {
    setSelectedQuotation(null);
  };

  const filteredQuotations = quotations.filter((q) =>
    q.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Purchase Orders</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search quotations by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
      </div>

      {/* Main Layout */}
      <div className="flex gap-4">
        {/* Left Side - Add Quotation Form */}
        <div className="w-1/3 bg-white p-4 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4">Add Quotation</h2>
          <input
            type="text"
            placeholder="Enter quotation name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border rounded-lg p-2 w-full mb-2"
          />
          <textarea
            placeholder="Enter a detailed quotation description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="border rounded-lg p-3 w-full h-32 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700 resize-none mb-2"
          ></textarea>
          <input
            type="number"
            placeholder="Enter full price"
            value={newFullPrice}
            onChange={(e) => setNewFullPrice(e.target.valueAsNumber || "")}
            className="border rounded-lg p-2 w-full mb-2"
          />
          <button
            onClick={handleAddQuotation}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
          >
            Add Quotation
          </button>
        </div>

        {/* Right Side - Quotation List */}
        <div className="w-2/3 bg-white p-4 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4">Quotations</h2>
          {filteredQuotations.length === 0 ? (
            <p className="text-gray-500">No quotations found.</p>
          ) : (
            filteredQuotations.map((quotation) => (
              <div
                key={quotation.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow-sm mb-2 cursor-pointer"
                onClick={() => handleOpenModal(quotation)}
              >
                <div>
                  <h3 className="font-bold text-lg">{quotation.name}</h3>
                  <p className="text-sm text-gray-500">
                    Price: ${quotation.fullPrice.toFixed(2)}
                  </p>
                  <p
                    className={`text-sm ${
                      quotation.approved ? "text-green-600 font-bold" : ""
                    }`}
                  >
                    {quotation.description}
                  </p>
                </div>
                <button
                  onClick={() => handleApproveQuotation(quotation.id)}
                  className={`ml-2 px-4 py-2 rounded-md ${
                    quotation.approved
                      ? "bg-gray-400 text-white hover:bg-gray-500"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {quotation.approved ? "Unapprove" : "Approve"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteQuotation(quotation.id);
                  }}
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for Viewing Full Quotation */}
      {selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Quotation Details</h2>
            <p className="text-gray-700 mb-4">
              <strong>Name:</strong> {selectedQuotation.name}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Price:</strong> ${selectedQuotation.fullPrice.toFixed(2)}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Description:</strong> {selectedQuotation.description}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrders;
