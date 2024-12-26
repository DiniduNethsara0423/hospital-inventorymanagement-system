"use client"
import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
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
    // Simulate backend API call
    const suggestions = await fakeQuotationSearch(value); // Replace with actual API call
    setQuotationSuggestions(suggestions);
  };

  const handleAddInvoice = () => {
    // Logic to add invoice
  };

  return (
    <div className="p-6 w-full mx-auto mt-10">
      {/* Add New Invoice */}
      <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Invoice</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Date Range Picker */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date Range
            </label>
            <div
              className="border border-gray-300 px-4 py-2 rounded-lg text-sm cursor-pointer bg-white"
              onClick={() => setShowDatePicker((prev) => !prev)}
            >
              {newInvoice.dateRange ? (
                `${newInvoice.dateRange.startDate.toLocaleDateString()} - ${newInvoice.dateRange.endDate.toLocaleDateString()}`
              ) : (
                "Choose Date Range"
              )}
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

          {/* Quotation ID Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quotation ID
            </label>
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
                    onClick={() =>
                      setNewInvoice({ ...newInvoice, quotationId: item })
                    }
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Invoice PDF Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Invoice PDF
            </label>
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
                  setNewInvoice({
                    ...newInvoice,
                    invoicePdf: e.target.files ? e.target.files[0] : null,
                  })
                }
              />
              {newInvoice.invoicePdf && (
                <p className="mt-2 text-sm text-gray-600">
                  {newInvoice.invoicePdf.name}
                </p>
              )}
            </div>
          </div>

          {/* Add Button */}
          <div className="flex items-end">
            <button
              onClick={handleAddInvoice}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="table-auto w-full text-left bg-white">
          <thead className="bg-blue-100 text-gray-800 text-sm font-medium">
            <tr>
              <th className="px-6 py-3">Quotation ID</th>
              <th className="px-6 py-3">Invoice ID</th>
              <th className="px-6 py-3">Purchase Request ID</th>
              <th className="px-6 py-3">Purchase Req. PDF</th>
              <th className="px-6 py-3">Invoice PDF</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-t hover:bg-gray-100">
                <td className="px-6 py-3">{invoice.quotationId}</td>
                <td className="px-6 py-3">{invoice.invoiceId}</td>
                <td className="px-6 py-3">{invoice.purchaseRequestId}</td>
                <td className="px-6 py-3">
                  <a
                    href={invoice.purchaseRequestPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View PDF
                  </a>
                </td>
                <td className="px-6 py-3">
                  <a
                    href={invoice.invoicePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View PDF
                  </a>
                </td>
                <td className="px-6 py-3 flex gap-2">
                  <button className="px-3 py-1 text-sm text-yellow-600 bg-yellow-100 rounded-lg hover:bg-yellow-200">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Simulated API call
const fakeQuotationSearch = async (query) => {
  const suggestions = ["Q12345", "Q12346", "Q12347"];
  return suggestions.filter((id) => id.includes(query));
};

export default OrdersPage;
