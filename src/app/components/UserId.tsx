import React, { useEffect, useState } from 'react';
import { getAllUsers } from '@/app/apis/get-all-users/api';
import { getLogsByUserId } from '@/app/apis/logs/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Log {
  id: number;
  action: string;
  timestamp: string;
}

const UserId: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<Log[]>([]); // Ensure logs is initialized as an empty array
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
      setLogs(data?.data || []); // Safely set logs, default to an empty array if undefined
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
      setLogs([]); // Clear logs when no user is selected
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">User Logs</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="mb-4">
          <label htmlFor="userDropdown" className="block font-medium mb-1">
            Select User:
          </label>
          <select
            id="userDropdown"
            value={userId || ''}
            onChange={handleUserChange}
            className="px-4 py-2 border rounded w-full"
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

      <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
            <th className="border border-gray-300 px-4 py-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log.id} className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2">{log.id}</td>
                <td className="border border-gray-300 px-4 py-2">{log.action}</td>
                <td className="border border-gray-300 px-4 py-2">{log.timestamp}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4">
                No logs available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserId;
