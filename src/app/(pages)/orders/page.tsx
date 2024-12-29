"use client";
import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { createInvoice, uploadInvoicePDF, fetchInvoices, fetchQuotations, fetchPurchases } from "@/app/apis/invoice/api";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const OrdersPage = () => {
  const [newInvoice, setNewInvoice] = useState({
    dateRange: null,
    quotationId: "QUOT001",
    purchaseId: 1,
    invoiceId: "",
    invoicePdf: null,
  });

  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [quotations, setQuotations] = useState([]); // Quotations state

  const [currentQuotationPage, setCurrentQuotationPage] = useState(1); // Track current page for quotations
  const [isLoadingQuotations, setIsLoadingQuotations] = useState(false); // Track loading state
  const [hasMoreQuotations, setHasMoreQuotations] = useState(true);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [purchases, setPurchases] = useState([]); // Store loaded purchases
  const [purchasePage, setPurchasePage] = useState(1); // Current page
  const [hasMorePurchases, setHasMorePurchases] = useState(true); // Tracks if more data exists


  useEffect(() => {
    const getInvoices = async () => {
      try {
        const { results, count } = await fetchInvoices(currentPage, 7); // Fetch invoices
        const totalItems = count && count[0] && count[0]["COUNT(*)"]; // Total number of items
        const itemsPerPage = 7; // Define items per page
        setFilteredInvoices(results); // Set the fetched invoices
        setTotalPages(Math.ceil(totalItems / itemsPerPage)); // Calculate total pages
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      }
    };
    getInvoices();
  }, [currentPage]);

  useEffect(() => {
    const loadQuotations = async () => {
      if (isLoadingQuotations || !hasMoreQuotations) return;

      setIsLoadingQuotations(true);
      try {
        const { rows, count } = await fetchQuotations(currentQuotationPage, 10); // Fetch next page of quotations
        if (rows.length > 0) {
          setQuotations((prev) => [...prev, ...rows]); // Append new quotations to existing list
          setCurrentQuotationPage((prev) => prev + 1); // Increment page
        }
        if (rows.length < 10) {
          setHasMoreQuotations(false); // If fewer items were fetched, no more data
        }
      } catch (error) {
        console.error("Failed to fetch quotations:", error);
      } finally {
        setIsLoadingQuotations(false);
      }
    };

    loadQuotations();
  }, [currentQuotationPage, isLoadingQuotations, hasMoreQuotations]);

  const handleQuotationScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setCurrentQuotationPage((prev) => prev + 1); // Trigger the next page load
    }
  };


  const loadPurchases = async () => {
    if (!hasMorePurchases) return; // Exit if no more data to fetch

    try {
      const { rows, count } = await fetchPurchases(purchasePage, 10);
      setPurchases((prev) => [...prev, ...rows]); // Append new purchases
      if (purchases.length + rows.length >= count) {
        setHasMorePurchases(false); // No more pages
      } else {
        setPurchasePage((prev) => prev + 1); // Increment page
      }
    } catch (error) {
      console.error("Failed to load purchases:", error);
    }
  };

  const handlePurchasesScroll = (e) => {
    const target = e.target;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
      loadPurchases(); // Fetch more data when nearing the bottom
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);



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

  const handleAddInvoice = async () => {
    try {
      const { invoice_id } = await createInvoice({
        invoice_id: newInvoice.invoiceId,
        quotation_id: newInvoice.quotationId,
        purchase_id: newInvoice.purchaseId,
        pdf_path: "",
      });

      if (newInvoice.invoicePdf) {
        await uploadInvoicePDF(invoice_id, newInvoice.invoicePdf);
        alert("Invoice created and PDF uploaded successfully!");
      } else {
        alert("Invoice created successfully!");
      }
    } catch (error) {
      console.error("Failed to add invoice:", error);
      alert("Failed to add invoice. Please try again.");
    }
  };

  console.log(quotations)
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
            <div
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm overflow-y-auto"
              style={{ maxHeight: "200px" }} // Set max height for dropdown
              onScroll={handleQuotationScroll} // Trigger loading on scroll
            >
              <select
                className="w-full text-sm bg-white"
                value={newInvoice.quotationId}
                onChange={(e) => setNewInvoice({ ...newInvoice, quotationId: e.target.value })}
              >
                <option value="" disabled>Select Quotation</option>
                {quotations.map((quotation) => (
                  <option key={quotation.quotation_id} value={quotation.quotation_id}>
                    {quotation.quotation_id}
                  </option>
                ))}
              </select>
            </div>
            {isLoadingQuotations && (
              <p className="text-gray-500 text-sm mt-2">Loading more quotations...</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase ID</label>
            <div
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm overflow-auto max-h-40"
              onScroll={handlePurchasesScroll}
            >
              <select
                className="w-full"
                value={newInvoice.purchaseId}
                onChange={(e) => setNewInvoice({ ...newInvoice, purchaseId: Number(e.target.value) })}
              >
                {purchases.map((purchase) => (
                  <option key={purchase.id} value={purchase.id}>
                    {purchase.id}
                  </option>
                ))}
              </select>
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice ID</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              value={newInvoice.invoiceId}
              onChange={(e) => setNewInvoice({ ...newInvoice, invoiceId: e.target.value })}
            />
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
            <button
              onClick={handleAddInvoice}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
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
                <td className="px-6 py-3">{invoice.invoice_id_by_shop || "N/A"}</td>
                <td className="px-6 py-3">{invoice.purchase_id}</td>
                <td className="px-6 py-3">{invoice.vendors_id}</td>
                <td className="px-6 py-3">{invoice.total_value || "0"}</td>
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
          className={`px-4 py-2 bg-gray-200 rounded-lg shadow ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
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
          className={`px-4 py-2 bg-gray-200 rounded-lg shadow ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
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
