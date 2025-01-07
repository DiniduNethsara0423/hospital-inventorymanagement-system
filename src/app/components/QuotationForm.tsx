import React, { useState } from "react";

interface QuotationFormProps {
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>;
}

export const QuotationForm: React.FC<QuotationFormProps> = ({ setQuotations }) => {
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newFullPrice, setNewFullPrice] = useState<number | "">("");

  const handleAddQuotation = () => {
    if (newName.trim() === "" || newDescription.trim() === "" || newFullPrice === "") return;
    setQuotations(prev => [
      ...prev,
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

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-bold text-blue-900 mb-4">Add Quotation</h2>
      <input
        type="text"
        placeholder="Quotation Name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="border rounded-lg p-3 w-full mb-4"
      />
      <textarea
        placeholder="Detailed Description"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        className="border rounded-lg p-3 w-full h-32 mb-4"
      ></textarea>
      <input
        type="number"
        placeholder="Full Price"
        value={newFullPrice}
        onChange={(e) => setNewFullPrice(e.target.valueAsNumber || "")}
        className="border rounded-lg p-3 w-full mb-4"
      />
      <button
        onClick={handleAddQuotation}
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600"
      >
        Add Quotation
      </button>
    </div>
  );
};
