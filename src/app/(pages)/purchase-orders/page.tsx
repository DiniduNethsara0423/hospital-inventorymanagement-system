"use client";
import React, { useEffect, useState } from "react";
import { findAllPurchases, updateDeliveryStatus } from "@/app/apis/purchase-orders/api";

interface Purchase {
  id: number;
  vendor_id: string;
  quotation_id: string;
  approverd_by: string;
  approve_date: string;
  deliver_status: string;
  pdf_path: string;
  created_at: string;
  updated_at: string | null;
}

const PurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // Adjust as needed
  const [totalCount, setTotalCount] = useState(0);
  const baseUrl:any = process.env.NEXT_PUBLIC_BASE_URL

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const data = await findAllPurchases(page, pageSize);
      setPurchases(data.rows);
      setTotalCount(parseInt(data.totalCount, 10)); // Convert totalCount to number
    } catch (error) {
      console.error("Failed to fetch purchases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [page]);

  const handleStatusChange = async (id: any, newStatus: string) => {
    try {
      await updateDeliveryStatus(id, newStatus);
      setPurchases((prev) =>
        prev.map((purchase) =>
          purchase.id === id ? { ...purchase, deliver_status: newStatus } : purchase
        )
      );
    } catch (error) {
      alert("Failed to update delivery status.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center my-10">Purchased Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="min-w-full  border-gray-200">
            <thead>
              <tr className="bg-blue-200">
                <th className="p-2 rounded-tl-lg">ID</th>
                <th className="p-2 border">Vendor ID</th>
                <th className="p-2 border">Approved By</th>
                <th className="p-2 border">Quotation ID</th>
                <th className="p-2 border">Approved Date</th>
                <th className="p-2 border">Delivery Status</th>
                <th className="p-2 rounded-tr-lg">PDF</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="text-center border">
                  <td className="p-2 border">{purchase.id}</td>
                  <td className="p-2 border">{purchase.vendor_id}</td>
                  <td className="p-2 border">{purchase.approverd_by}</td>
                  <td className="p-2 border">{purchase.quotation_id}</td>
                  <td className="p-2 border">{new Date(purchase.approve_date).toLocaleDateString()}</td>
                  <td className="p-2 border">
                    <select
                      value={purchase.deliver_status}
                      onChange={(e) => handleStatusChange(purchase.id, e.target.value)}
                      className="border px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="p-2 border">
                    <a href={`${baseUrl}/${purchase.pdf_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      View PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-gray-700 text-white"}`}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page} of {Math.ceil(totalCount / pageSize)}</span>
            <button
              onClick={() => setPage((prev) => (prev * pageSize < totalCount ? prev + 1 : prev))}
              className={`px-4 py-2 rounded ${page * pageSize >= totalCount ? "bg-gray-400 cursor-not-allowed" : "bg-gray-700 text-white"}`}
              disabled={page * pageSize >= totalCount}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PurchasesPage;
