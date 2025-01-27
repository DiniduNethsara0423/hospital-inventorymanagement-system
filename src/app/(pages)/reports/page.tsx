"use client";

import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { downloadReport, fetchInventoryData } from "@/app/apis/reports/api"; // Adjust path
import "react-date-range/dist/styles.css"; // Main style file for DateRangePicker
import "react-date-range/dist/theme/default.css"; // Default theme
import { useRouter } from "next/navigation";

interface InventoryItem {
  barcode: string;
  name: string;
  price: string;
  qty: number;
  invoice_id: string;
  maintance_date: string;
  removed_qty: number;
  removed_purpose: string;
}

const Page: React.FC = () => {
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);

  const router = useRouter();
  
    useEffect(() => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/login');
      }
    }, [router]);

  const handleDateRangeSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange({ startDate, endDate });
    setShowDatePicker(false);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const formattedStartDate = dateRange.startDate
        .toISOString()
        .split("T")[0];
      const formattedEndDate = dateRange.endDate.toISOString().split("T")[0];
      await downloadReport(formattedStartDate, formattedEndDate);
    } catch (error) {
      alert("Failed to download the report. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const loadInventoryData = async () => {
    try {
      const data = await fetchInventoryData();
      setInventoryData(data);
    } catch (error) {
      alert("Failed to load inventory data.");
    }
  };

  useEffect(() => {
    loadInventoryData();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Hospital Reports</h1>

      {/* Flexbox Layout for Date Range and Button */}
      <div className="flex items-center gap-4 mb-6">
        {/* Date Range Selector */}
        <div className="relative flex-1">
          <div
            className="border border-gray-300 px-4 py-3 rounded-lg text-sm cursor-pointer bg-white"
            onClick={() => setShowDatePicker((prev) => !prev)}
          >
            {dateRange.startDate && dateRange.endDate
              ? `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`
              : "Choose Date Range"}
          </div>
          {showDatePicker && (
            <div className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg">
              <DateRangePicker
                ranges={[
                  {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                    key: "selection",
                  },
                ]}
                onChange={handleDateRangeSelect}
                rangeColors={["#2563eb"]}
              />
            </div>
          )}
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-48 py-3 rounded-lg font-bold text-white shadow-lg transition-all duration-300 ${
            isDownloading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-700 hover:bg-gray-800"
          }`}
        >
          {isDownloading ? "Downloading..." : "Download Report"}
        </button>
      </div>

      {/* Inventory Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b">Barcode</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Price</th>
              <th className="px-4 py-2 border-b">Quantity</th>
              <th className="px-4 py-2 border-b">Invoice ID</th>
              <th className="px-4 py-2 border-b">Maintenance Date</th>
              <th className="px-4 py-2 border-b">Removed Qty</th>
              <th className="px-4 py-2 border-b">Removed Purpose</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.length > 0 ? (
              inventoryData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{item.barcode}</td>
                  <td className="px-4 py-2 border-b">{item.name}</td>
                  <td className="px-4 py-2 border-b">{item.price}</td>
                  <td className="px-4 py-2 border-b">{item.qty}</td>
                  <td className="px-4 py-2 border-b">{item.invoice_id}</td>
                  <td className="px-4 py-2 border-b">
                    {new Date(item.maintance_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b">{item.removed_qty}</td>
                  <td className="px-4 py-2 border-b">{item.removed_purpose}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center px-4 py-2 border-b text-gray-500"
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
