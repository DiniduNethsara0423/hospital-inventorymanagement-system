import React, { useState } from "react";
import { getLogsByTableAndDate } from "@/app/apis/logs/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "./Modal";

const TableAndDate: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState("category_log");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  
  const handleTableChange = (table: string) => {
    setSelectedTable(table);
  };

  const fetchLogs = async () => {
    if (!selectedDate) {
      setModalMessage("Please select a date.");
    setModalType("error");
    setIsModalOpen(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getLogsByTableAndDate(
        currentPage.toString(),
        // pageSize.toLocaleString(),
        "1000",
        selectedDate,
        selectedTable
      );
      setLogs(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch logs.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(total / pageSize)) return;
    setCurrentPage(page);
    fetchLogs();
  };

  return (
    <div className="p- bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Table and Date Selector
      </h1>

      <div className=" bg-white p-">
        {/* Dropdown for selecting table */}
        <div className="flex max-lg:flex-col  justify-between lg:gap-10">
        <div className="mb-6 lg:w-2/3 w-full">
          <label htmlFor="tableSelector" className="block font-semibold text-gray-700 mb-2">
            Select Table:
          </label>
          <select
            id="tableSelector"
            value={selectedTable}
            onChange={(e) => handleTableChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="category_log">category log</option>
            <option value="department_log">department log</option>
            <option value="invoices_log">invoices log</option>
            <option value="item_departments_log">item departments log</option>
            <option value="item_details_log">item details log</option>
            <option value="items_log">items log</option>
            <option value="purchase_request_log">purchase_request log</option>
            <option value="purchases_log">purchases log</option>
            <option value="quotations_log">quotations log</option>
            <option value="roles_log">roles log</option>
            <option value="users_log">users log</option>
            <option value="vendors_log">vendors log</option>
          </select>
        </div>

        {/* Date input and search button */}
        <div className="mb-4 lg:w-1/2 w-full">
          <label htmlFor="date" className="block font-semibold text-gray-700 mb-2">
            Enter Date (yyyy-mm-dd):
          </label>
          <div className="flex max-sm:flex-col max-sm:gap-4 items-center lg:space-x-5 w-full">
           <div className="w-full">
           <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 w-full py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
           </div>
            <button
              onClick={fetchLogs}
              className="px-6 py-2 max-sm:w-full bg-gray-700 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
              >
              Search
            </button>
          </div>
        </div>
        </div>

        {/* Display logs */}
        {loading ? (
          <p className="text-center text-blue-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto rounded-lg bg-white">
              <table className="table-auto w-full border-collapse text-sm text-gray-800">
              <thead>
                <tr className="bg-blue-200">
                  {Object.keys(logs[0]).map((key) => (
                    <th key={key} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      {key.replace(/_/g, " ").toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index} className="hover:bg-blue-50">
                    {Object.values(log).map((value: any, idx) => (
                      <td key={idx} className="border border-gray-300 px-4 py-2">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No logs found.</p>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div>
            <label htmlFor="pageSize" className="font-semibold mr-2">
              Page Size:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setCurrentPage(1);
                fetchLogs();
              }}
              className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          {/* <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 bg-gray-200 rounded-lg shadow ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"} transition`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="mx-2 text-lg">Page {currentPage}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(total / pageSize)}
            className={`px-4 py-2 bg-gray-200 rounded-lg shadow ${currentPage === Math.ceil(total / pageSize) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"} transition`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div> */}
        </div>
      </div>
      <Modal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  message={modalMessage} 
  type={modalType} 
/>

    </div>
  );
};

export default TableAndDate;
