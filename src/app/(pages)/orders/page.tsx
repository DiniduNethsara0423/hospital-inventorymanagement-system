"use client";
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { fetchInvoices } from "@/app/apis/invoice/page"; // Import the API function
import "react-date-range/dist/styles.css"; // Main style
import "react-date-range/dist/theme/default.css"; // Theme style

const OrdersPage = () => {
  const [newInvoice, setNewInvoice] = useState({
    dateRange: null,
    quotationId: "",
    invoicePdf: null,
  });
  const [quotationSuggestions, setQuotationSuggestions] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getInvoices = async () => {
      try {
        const {results, count} = await fetchInvoices(currentPage, 10); // Fetch invoices
        const itemsperpage = count && count[0] && count[0]["COUNT(*)"];
        setFilteredInvoices(results); // Set the fetched invoices
        setTotalPages(itemsperpage); // Set total pages
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      }
    };
    getInvoices();
  }, [currentPage]);

  const handleDateRangeSelect = (ranges) => {
    setNewInvoice({
      ...newInvoice,
      dateRange: {
        startDate: ranges.selection.startDate,
        endDate: ranges.selection.endDate,
      },
    });
    setShowDatePicker(false);
  };

  const handleQuotationSearch = async (value) => {
    setNewInvoice({ ...newInvoice, quotationId: value });
    const suggestions = await fakeQuotationSearch(value); // Replace with actual API call
    setQuotationSuggestions(suggestions);
  };

  const handleAddInvoice = () => {
    // Logic to add new invoice
  };

  return (
    <div className="p-6 w-full mx-auto mt-10">
      {/* Add New Invoice */}
      <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Invoice</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date Range</label>
            <div
              className="border border-gray-300 px-4 py-2 rounded-lg text-sm cursor-pointer bg-white"
              onClick={() => setShowDatePicker((prev) => !prev)}
            >
              {newInvoice.dateRange
                ? `${newInvoice.dateRange.startDate.toLocaleDateString()} - ${newInvoice.dateRange.endDate.toLocaleDateString()}`
                : "Choose Date Range"}
            </div>
            {showDatePicker && (
              <div className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg">
                <DateRangePicker
                  ranges={[{ startDate: new Date(), endDate: new Date(), key: "selection" }]}
                  onChange={handleDateRangeSelect}
                  rangeColors={["#2563eb"]}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quotation ID</label>
            <input
              type="text"
              placeholder="Search Quotation ID"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              value={newInvoice.quotationId}
              onChange={(e) => handleQuotationSearch(e.target.value)}
            />
            {quotationSuggestions.length > 0 && (
              <ul className="bg-white border rounded-lg shadow-lg mt-2">
                {quotationSuggestions.map((item) => (
                  <li
                    key={item}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => setNewInvoice({ ...newInvoice, quotationId: item })}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Invoice PDF</label>
            <div className="relative">
              <label
                htmlFor="invoice-upload"
                className="block text-sm border border-gray-300 px-4 py-2 rounded-lg text-gray-700 cursor-pointer bg-white hover:border-2"
              >
                Choose PDF File
              </label>
              <input
                id="invoice-upload"
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={(e) =>
                  setNewInvoice({ ...newInvoice, invoicePdf: e.target.files ? e.target.files[0] : null })
                }
              />
              {newInvoice.invoicePdf && <p className="mt-2 text-sm text-gray-600">{newInvoice.invoicePdf.name}</p>}
            </div>
          </div>

          <div className="flex items-end">
            <button onClick={handleAddInvoice} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Add Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="table-auto w-full text-left bg-white">
          <thead className="bg-blue-100 text-gray-800 text-sm font-medium">
            <tr>
              <th className="px-6 py-3">Quotation ID</th>
              <th className="px-6 py-3">Invoice ID</th>
              <th className="px-6 py-3">Purchase Request ID</th>
              <th className="px-6 py-3">Vendor ID</th>
              <th className="px-6 py-3">Total Value</th>
              <th className="px-6 py-3">Invoice PDF</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.invoice_id} className="border-t hover:bg-gray-100">
                <td className="px-6 py-3">{invoice.quotation_id}</td>
                <td className="px-6 py-3">{invoice.invoice_id_by_shop}</td>
                <td className="px-6 py-3">{invoice.purchase_id}</td>
                <td className="px-6 py-3">{invoice.vendors_id}</td>
                <td className="px-6 py-3">{invoice.total_value}</td>
                <td className="px-6 py-3">
                  <a
                    href={invoice.pdf_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 bg-gray-200 rounded-lg shadow ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
          } transition`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => (currentPage < totalPages ? prev + 1 : prev))}
          className={`px-4 py-2 bg-gray-200 rounded-lg shadow ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
          } transition`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersPage;
