"use client";
import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { createInvoice, uploadInvoicePDF, fetchInvoices, fetchQuotations, fetchPurchases, generateInvoiceId, deleteInvoice } from "@/app/apis/invoice/api";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import debounce from 'lodash.debounce';
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const OrdersPage = () => {
  const [newInvoice, setNewInvoice]: any = useState({
    dateRange: null,
    quotationId: "",
    purchaseId: "",
    invoiceId: "",
    invoicePdf: null,
  });

  const [filteredInvoices, setFilteredInvoices]: any = useState([]);
  const [currentPage, setCurrentPage]: any = useState(1);
  const [totalPages, setTotalPages]: any = useState(1);
  const [quotations, setQuotations]: any = useState([]); // Quotations state

  const [currentQuotationPage, setCurrentQuotationPage]: any = useState(1); // Track current page for quotations
  const [isLoadingQuotations, setIsLoadingQuotations]: any = useState(false); // Track loading state
  const [hasMoreQuotations, setHasMoreQuotations]: any = useState(true);

  const [showDatePicker, setShowDatePicker]: any = useState(false);

  const [purchases, setPurchases]: any = useState([]); // Store loaded purchases
  const [purchasePage, setPurchasePage]: any = useState(1); // Current page
  const [hasMorePurchases, setHasMorePurchases]: any = useState(true); // Tracks if more data exists
  const baseUrl: any = process.env.NEXT_PUBLIC_BASE_URL
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

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



  const fetchAllQuotations = async () => {
    try {
      const { rows } = await fetchQuotations(1, 1000); // Fetch all quotations at once
      setQuotations(rows);
      setHasMoreQuotations(false); // Disable further pagination
    } catch (error) {
      console.error("Failed to fetch quotations:", error);
    }
  };

  const fetchAllPurchases = async () => {
    try {
      const { rows } = await fetchPurchases(1, 1000); // Fetch all purchases at once
      setPurchases(rows);
      setHasMorePurchases(false); // Disable further pagination
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
    }
  };

  useEffect(() => {
    fetchAllQuotations();
    fetchAllPurchases();
  }, []);


  const handleQuotationScroll = debounce((e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setCurrentQuotationPage((prev: any) => prev + 1); // Trigger the next page load
    }
  }, 200); // Delay of 200ms

  const handlePurchasesScroll = debounce((e) => {
    const target = e.target;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
      purchases(); // Fetch more data when nearing the bottom
    }
  }, 200); // Delay of 200ms

  const handleDateRangeSelect = (ranges: any) => {
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
        const { results, count } = await fetchInvoices(currentPage, 7);
        setFilteredInvoices(results);
        setTotalPages(Math.ceil(count[0]["COUNT(*)"] / 7));
  
        setModalContent({
          title: "Success",
          message: "Invoice created and PDF uploaded successfully!",
        });
        setModalVisible(true);
  
        setNewInvoice({
          dateRange: null,
          quotationId: "",
          purchaseId: "",
          invoiceId: "",
          invoicePdf: null,
        });
      } else {
        setModalContent({
          title: "Success",
          message: "Invoice created successfully!",
        });
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Failed to add invoice:", error);
      setModalContent({
        title: "Error",
        message: "Failed to add invoice. Please try again.",
      });
      setModalVisible(true);
    }
  };
  

  const handleGenerateInvoiceId = async () => {
    try {
      const invoiceId = await generateInvoiceId();
      setNewInvoice((prevState: any) => ({
        ...prevState,
        invoiceId: invoiceId,
      }));
    } catch (error) {
      alert("Failed to generate invoice ID. Please try again.");
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this invoice?");
    if (confirmDelete) {
      try {
        await deleteInvoice(invoiceId);
        setModalContent({
          title: "Success",
          message: "Invoice deleted successfully!",
        });
        setModalVisible(true);
  
        const { results, count } = await fetchInvoices(currentPage, 7);
        setFilteredInvoices(results);
        setTotalPages(Math.ceil(count[0]["COUNT(*)"] / 7));
      } catch (error) {
        setModalContent({
          title: "Error",
          message: "Failed to delete invoice. Please try again.",
        });
        setModalVisible(true);
      }
    }
  };
  

  const viewPdf = (base64String: string) => {
    // Convert base64 string to a Blob
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Create a Blob URL
    const blobUrl = URL.createObjectURL(blob);

    // Open PDF in a new tab
    window.open(blobUrl, "_blank");
  };

  const handlePurchaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPurchaseId = Number(e.target.value);
    const relatedPurchase = purchases.find((p: any) => p.id === selectedPurchaseId);

    if (relatedPurchase) {
      setNewInvoice((prev: any) => ({
        ...prev,
        purchaseId: selectedPurchaseId,
        quotationId: relatedPurchase.quotation_id, // Auto-set Quotation ID
      }));
    }
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
              onClick={() => setShowDatePicker((prev: any) => !prev)}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase ID</label>
            <div
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm overflow-auto max-h-40"
              onScroll={handlePurchasesScroll}
            >
              <select
                className="w-full"
                value={newInvoice.purchaseId || ""}
                onChange={handlePurchaseChange}
              >
                <option value="" disabled>Select Purchase</option>
                {purchases.map((purchase: any) => (
                  <option key={purchase.id} value={purchase.id}>
                    {purchase.id}
                  </option>
                ))}
              </select>

            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quotation ID</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-100"
              value={newInvoice.quotationId}
              readOnly // Make it non-editable
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice ID</label>
            <div className="flex items-center">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-100"
                value={newInvoice.invoiceId}
                readOnly // Disable the text field
              />
              <button
                onClick={handleGenerateInvoiceId}
                className="ml-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                Generate
              </button>
            </div>
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
      <div className="rounded-lg border border-gray-300">
  {/* Table for lg & xl screens */}
  <div className="hidden lg:block overflow-x-auto">
    <table className="table-auto w-full text-left bg-white min-w-[600px]">
      <thead className="bg-blue-100 text-gray-800 text-sm font-medium">
        <tr>
          <th className="px-6 py-3">Quotation ID</th>
          <th className="px-6 py-3">Invoice ID</th>
          <th className="px-6 py-3">Purchase ID</th>
          <th className="px-6 py-3">Vendor ID</th>
          <th className="px-6 py-3">Total Value</th>
          <th className="px-6 py-3 whitespace-nowrap">Invoice PDF</th>
          <th className="px-6 py-3 text-center whitespace-nowrap">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredInvoices.map((invoice: any) => (
          <tr key={invoice.invoice_id} className="border-t hover:bg-gray-100">
            <td className="px-6 py-3">{invoice.quotation_id}</td>
            <td className="px-6 py-3">{invoice.invoice_id || "N/A"}</td>
            <td className="px-6 py-3">{invoice.purchase_id}</td>
            <td className="px-6 py-3">{invoice.vendors_id}</td>
            <td className="px-6 py-3">{invoice.total_value || "0"}</td>
            <td className="px-6 py-3 whitespace-nowrap">
              <a
                href={`${baseUrl}/${invoice.pdf_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View PDF
              </a>
            </td>
            <td className="text-center px-6 py-3">
              <button
                onClick={() => handleDeleteInvoice(invoice.invoice_id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={20} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Cards for sm & md screens */}
  <div className="lg:hidden space-y-4 p-4">
    {filteredInvoices.map((invoice: any) => (
      <div key={invoice.invoice_id} className="bg-white shadow rounded-lg p-4 border border-gray-200">
        <p className="text-gray-700">
          <strong>Quotation ID:</strong> {invoice.quotation_id}
        </p>
        <p className="text-gray-700">
          <strong>Invoice ID:</strong> {invoice.invoice_id || "N/A"}
        </p>
        <p className="text-gray-700">
          <strong>Purchase ID:</strong> {invoice.purchase_id}
        </p>
        <p className="text-gray-700">
          <strong>Vendor ID:</strong> {invoice.vendors_id}
        </p>
        <p className="text-gray-700">
          <strong>Total Value:</strong> {invoice.total_value || "0"}
        </p>
        <p>
          <a
            href={`${baseUrl}/${invoice.pdf_path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View PDF
          </a>
        </p>
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => handleDeleteInvoice(invoice.invoice_id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    ))}
  </div>
</div>


      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage((prev: any) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 bg-gray-200 rounded-lg shadow ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
            } transition`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">
          Page {currentPage}
        </span>
        <button
          onClick={() => setCurrentPage((prev: any) => (currentPage < totalPages ? prev + 1 : prev))}
          className={`px-4 py-2 bg-gray-200 rounded-lg shadow ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
            } transition`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{modalContent.title}</h2>
            <p className="mb-4">{modalContent.message}</p>
            <button
              onClick={() => setModalVisible(false)}
              className="hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrdersPage;
