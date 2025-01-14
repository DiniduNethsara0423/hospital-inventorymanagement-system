import React, { useState } from 'react';
import { getLogsByDate } from '@/app/apis/logs/api'; 

const DatePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedDate, setSelectedDate] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch logs from the API
  const fetchLogs = async () => {
    if (!selectedDate) {
      alert('Please enter a valid date in yyyy-mm-dd format.');
      return;
    }

    try {
      const data = await getLogsByDate(
        currentPage.toString(),
        pageSize.toString(),
        selectedDate
      );
      setLogs(data.logs); // Adjust based on API response structure
      setTotalPages(Math.ceil(data.total / pageSize)); // Adjust based on total count
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Date Logs</h1>

      {/* Date Input with Search Button */}
      <div className="mb-4">
        <label htmlFor="date" className="block font-medium mb-1">
          Enter Date (yyyy-mm-dd):
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            placeholder="yyyy-mm-dd"
            className="px-4 py-2 border rounded w-64"
          />
          <button
            onClick={fetchLogs}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        <p className="mt-2">Selected Date: {selectedDate ? selectedDate.replace(/-/g, '/') : 'None'}</p>
      </div>

      {/* Table */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
  {Array.isArray(logs) && logs.length > 0 ? (
    logs.map((log) => (
      <tr key={log.id} className="hover:bg-blue-50">
        <td className="border border-gray-300 px-4 py-2">{log.id}</td>
        <td className="border border-gray-300 px-4 py-2">{log.name}</td>
        <td className="border border-gray-300 px-4 py-2">{log.email}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={3} className="text-center py-4">
        No logs found for the selected date.
      </td>
    </tr>
  )}
</tbody>

      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <label htmlFor="pageSize" className="mr-2">Page Size:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-2 py-1 border rounded"
          >
            {[5, 10, 15].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePage;
