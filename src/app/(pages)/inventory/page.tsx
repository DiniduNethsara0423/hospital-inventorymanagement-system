

"use client";
import React, { useEffect, useState } from "react";
import Items from "@/app/components/Items";
import ItemDetails from "@/app/components/ItemDetails";
import { useRouter } from "next/navigation";


const ItemsPage: React.FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"items" | "itemDetails">("items");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  
    useEffect(() => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/login');
      }
    }, [router]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-8 w-full min-h-screen bg-white">

      <div className="flex  justify-between items-center mb-6">
        <h1 className="text-4xl max-sm:text-xl  font-bold text-gray-800">Inventory </h1>
        <button
          className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 max-lg:px-4 max-lg:py-2 rounded-lg text-base shadow-lg font-semibold"
          onClick={() => router.push("/add-Inventory")}
        >
          Add New Item
        </button>
      </div>

      <div className="flex justify-center mb-4 max-sm:my-10">
        <button
          className={`px-4 py-2 ${activeTab === "items" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("items")}
        >
          Items
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "itemDetails" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("itemDetails")}
        >
          Item Details
        </button>
      </div>

      {activeTab === "items" ? (
        <Items
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onTotalItemsChange={setTotalItems}
        />
      ) : (
        <ItemDetails
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onTotalItemsChange={setTotalItems}
        />
      )}

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`px-2 py-1 mx-1 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ItemsPage;
