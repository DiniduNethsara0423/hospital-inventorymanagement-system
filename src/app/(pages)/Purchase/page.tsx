"use client";
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
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedPDFs, setUploadedPDFs] = useState<
    Record<number, { file: File; approved: boolean }[]>
  >({});

  const handleAddQuotation = () => {
    if (
      newName.trim() === "" ||
      newDescription.trim() === "" ||
      newFullPrice === ""
    )
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
    setUploadedPDFs((prev) => {
      const newUploadedPDFs = { ...prev };
      delete newUploadedPDFs[id];
      return newUploadedPDFs;
    });
  };

  const handleApproveQuotation = (id: number) => {
    setQuotations(
      quotations.map((q) => (q.id === id ? { ...q, approved: !q.approved } : q))
    );
  };

  const handleOpenModal = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
  };

  const handleCloseModal = () => {
    setSelectedQuotation(null);
  };

  const handleUploadPDFs = (files: FileList | null, quotationId: number) => {
    if (!files) return;
    const newFiles = Array.from(files).map((file) => ({
      file,
      approved: false,
    }));
    setUploadedPDFs((prev) => ({
      ...prev,
      [quotationId]: [...(prev[quotationId] || []), ...newFiles],
    }));
  };

  const handleApproveSelectedPDFs = (quotationId: number) => {
    setUploadedPDFs((prev) => ({
      ...prev,
      [quotationId]: prev[quotationId].map((pdf) =>
        selectedPDFs[quotationId]?.includes(pdf.file.name)
          ? { ...pdf, approved: true }
          : pdf
      ),
    }));
    setSelectedPDFs((prev) => ({ ...prev, [quotationId]: [] }));
  };

  const [selectedPDFs, setSelectedPDFs] = useState<Record<number, string[]>>(
    {}
  );

  const togglePDFSelection = (quotationId: number, fileName: string) => {
    setSelectedPDFs((prev) => ({
      ...prev,
      [quotationId]: prev[quotationId]?.includes(fileName)
        ? prev[quotationId].filter((name) => name !== fileName)
        : [...(prev[quotationId] || []), fileName],
    }));
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
  <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
    <div
      className="bg-white rounded-lg shadow-xl w-2/5 p-6 relative overflow-hidden"
      style={{
        maxHeight: "90vh", // Limits the height of the modal
        overflowY: "auto", // Adds vertical scrolling if content exceeds maxHeight
      }}
    >
      {/* Modal Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Quotation Details</h2>
        <button
          onClick={handleCloseModal}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>

      {/* Quotation Details */}
      <div className="space-y-4 mb-6">
        <p className="text-lg text-gray-700">
          <strong className="font-medium text-gray-800">Name:</strong>{" "}
          {selectedQuotation.name}
        </p>
        <p className="text-lg text-gray-700">
          <strong className="font-medium text-gray-800">Price:</strong> ${" "}
          {selectedQuotation.fullPrice.toFixed(2)}
        </p>
        <p className="text-lg text-gray-700">
          <strong className="font-medium text-gray-800">Description:</strong>{" "}
          {selectedQuotation.description}
        </p>
      </div>

      {/* File Upload Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Upload Supplier PDFs
        </h3>
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={(e) => handleUploadPDFs(e.target.files, selectedQuotation.id)}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Uploaded PDFs */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Uploaded PDFs
        </h3>
        <ul className="space-y-2">
          {(uploadedPDFs[selectedQuotation?.id] || []).map((pdf, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={
                    selectedPDFs[selectedQuotation.id]?.includes(pdf.file.name) ||
                    false
                  }
                  onChange={() =>
                    togglePDFSelection(selectedQuotation.id, pdf.file.name)
                  }
                />
                <a
                  href={URL.createObjectURL(pdf.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-blue-600 underline ${
                    pdf.approved ? "font-semibold text-green-600" : ""
                  }`}
                >
                  {pdf.file.name}
                </a>
              </div>
              <span
                className={`text-sm ${
                  pdf.approved
                    ? "text-green-500 font-bold"
                    : "text-gray-500"
                }`}
              >
                {pdf.approved ? "Approved" : ""}
              </span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => handleApproveSelectedPDFs(selectedQuotation.id)}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-all"
        >
          Approve Selected PDFs
        </button>
      </div>

      {/* Approved PDFs */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Approved PDFs
        </h3>
        <ul className="space-y-2">
          {(uploadedPDFs[selectedQuotation?.id] || [])
            .filter((pdf) => pdf.approved)
            .map((pdf, index) => (
              <li
                key={index}
                className="flex items-center bg-green-50 p-3 rounded-lg shadow-sm"
              >
                <span className="text-green-500 font-semibold mr-3">✔</span>
                <a
                  href={URL.createObjectURL(pdf.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {pdf.file.name}
                </a>
              </li>
            ))}
        </ul>
      </div>

      {/* Close Button */}
      <div className="text-right">
        <button
          onClick={handleCloseModal}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all"
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
