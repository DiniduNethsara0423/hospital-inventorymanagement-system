"use client";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { QuotationForm } from "@/app/components/QuotationForm"; 
import { QuotationList } from "@/app/components/QuotationList"; 
import { QuotationModal } from "@/app/components/QuotationModal"; 
import { useRouter } from "next/navigation";

const PurchaseOrders: React.FC = () => {
  const [quotations, setQuotations]:any = useState([]);
  const [searchQuery, setSearchQuery]:any = useState("");
  const [selectedQuotation, setSelectedQuotation]:any = useState(null);

  const router = useRouter();
  
    useEffect(() => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/login');
      }
    }, [router]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-6 mt-4">
        Purchase Orders
      </h1>

      {/* Search Bar */}
      <div className="mb-6 flex items-center bg-white rounded-full border px-4 py-2">
        <FaSearch className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Search quotations by name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full outline-none text-gray-600"
        />
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Add Quotation Form */}
        <QuotationForm setQuotations={setQuotations} />

        {/* Right Side - Quotation List */}
        <QuotationList
          quotations={quotations}
          searchQuery={searchQuery}
          setSelectedQuotation={setSelectedQuotation}
        />
      </div>

      {/* Modal for Viewing Full Quotation */}
      {selectedQuotation && (
        <QuotationModal
          selectedQuotation={selectedQuotation}
          setSelectedQuotation={setSelectedQuotation}
        />
      )}
    </div>
  );
};

export default PurchaseOrders;
