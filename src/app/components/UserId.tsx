import React, { useEffect, useState } from "react";
import { getAllUsers } from "@/app/apis/get-all-users/api";
import { getLogsByUserId } from "@/app/apis/logs/api";

interface User {
  id: number;
  name: string;
  email: string;
}

interface LogsResponse {
  [key: string]: any[]; // Flexible type to accommodate different log structures
}

const UserId: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<LogsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const fetchLogs = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLogsByUserId(id.toString());
      setLogs(data); // Update logs state with the fetched object
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setUserId(selectedId);
    if (selectedId) {
      fetchLogs(selectedId);
    } else {
      setLogs(null); // Clear logs when no user is selected
    }
  };

  const renderLogsTable = (logs: any[], logType: string) => (
    <div className="overflow-x-auto mt-6 ">
      <h2 className="text-lg font-semibold mb-2 capitalize text-gray-700">{logType}</h2>
      <table className="table-auto w-full border border-gray-200 rounded-md bg-white text-sm">
        <thead>
          <tr className="bg-indigo-100 text-left">
            {Object.keys(logs[0]).map((key) => (
              <th key={key} className="border border-gray-200 px-4 py-2 text-gray-600">
                {key.replace(/_/g, " ").toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 text-gray-700"
            >
              {Object.values(log).map((value: any, i) => (
                <td key={i} className="border border-gray-200 px-4 py-2">
                  {value !== null ? value.toString() : "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Logs</h1>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="mb-6">
          <label htmlFor="userDropdown" className="block text-gray-700 font-medium mb-2">
            Select User:
          </label>
          <select
            id="userDropdown"
            value={userId || ""}
            onChange={handleUserChange}
            className="px-4 py-2 border border-gray-300 rounded-md w-full text-gray-700 bg-white focus:outline-none focus:ring focus:ring-gray-300"
          >
            <option value="" disabled>
              -- Select a User --
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.id} - {user.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {logs ? (
        Object.entries(logs).map(([logType, logEntries]) =>
          logEntries.length > 0 ? renderLogsTable(logEntries, logType) : null
        )
      ) : (
        <p className="text-center text-gray-500 py-4">No logs available.</p>
      )}
    </div>
  );
};

export default UserId;
