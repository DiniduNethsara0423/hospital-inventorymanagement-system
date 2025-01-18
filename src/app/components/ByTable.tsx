import React, { useEffect, useState } from 'react';
import { getLogsByTableName } from '@/app/apis/logs/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Page: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedTable, setSelectedTable] = useState('category_log');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getLogsByTableName(
        currentPage.toString(),
        pageSize.toString(),
        selectedTable
      );
      const logs = result || [];
      setData(logs);
      setTotal(result.total || 0);

      if (logs.length > 0) {
        const dynamicColumns = Object.keys(logs[0]);
        setColumns(dynamicColumns);
      } else {
        setColumns([]);
      }
    } catch (err: any) {
      setError(err.message);
      setData([]);
      setColumns([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, pageSize, selectedTable]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleTableChange = (tableName: string) => {
    setSelectedTable(tableName);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen ">
      <div className=" py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Logs Viewer</h1>

        {/* Table Selector */}
        <div className="mb-6  rounded-lg bg-white ">
          <label htmlFor="tableSelector" className="block font-medium mb-2 text-gray-700">
            Table Name Selector:
          </label>
          <select
            id="tableSelector"
            value={selectedTable}
            onChange={(e) => handleTableChange(e.target.value)}
            className="px-4 py-2 border-2 rounded w-full focus:outline-none focus:ring-2"
          >
            <option value="category_log">Category Log</option>
            <option value="department_log">Department Log</option>
            <option value="invoices_log">Invoices Log</option>
            <option value="item_departments_log">Item Departments Log</option>
            <option value="item_details_log">Item Details Log</option>
            <option value="items_log">Items Log</option>
            <option value="purchase_request_log">Purchase Request Log</option>
            <option value="purchases_log">Purchases Log</option>
            <option value="quotations_log">Quotations Log</option>
            <option value="roles_log">Roles Log</option>
            <option value="users_log">Users Log</option>
            <option value="vendors_log">Vendors Log</option>
          </select>
        </div>

        {/* Pagination and Page Size */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <label htmlFor="pageSize" className="mr-2 font-medium text-gray-700">
              Rows per page:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-2 border rounded text-gray-700 bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

        </div>

        {/* Table Display */}
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-white">
            <table className="table-auto w-full border-collapse text-sm text-gray-800">
              <thead>
                <tr className="bg-indigo-100">
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="border border-gray-300 px-4 py-2 text-left font-semibold"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-indigo-50 transition-colors"
                  >
                    {columns.map((column) => (
                      <td
                        key={column}
                        className="border border-gray-300 px-4 py-2 text-left"
                      >
                        {row[column] !== null && row[column] !== undefined
                          ? row[column]
                          : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center mt-6 space-x-4">

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-gray-200 rounded-lg shadow ${currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-300"
            } transition`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="mx-2 text-lg">
          Page {currentPage}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(total / pageSize)}
          className={`px-4 py-2 bg-gray-200 rounded-lg shadow 
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300"
              } transition`}

        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Page;
