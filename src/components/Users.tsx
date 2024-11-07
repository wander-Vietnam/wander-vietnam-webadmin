import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, deleteUser } from '../redux/userSlice';
import { RootState, AppDispatch } from '../redux/store';

const Users: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Hàm xóa người dùng
  const handleDelete = (userId: string) => {
    dispatch(deleteUser(userId));
  };

  // Hàm định dạng lại ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Trả về định dạng yyyy-mm-dd
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {loading && <p className="text-gray-600 italic">Loading...</p>}
      {error && <p className="text-red-600">{typeof error === 'string' ? error : JSON.stringify(error)}</p>}

      {users.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 border-b text-left w-[300px]">Full Name</th> {/* Làm rộng cột Full Name */}
              <th className="py-3 px-4 border-b text-left">Email</th>
              <th className="py-3 px-4 border-b text-left">Phone</th>
              <th className="py-3 px-4 border-b text-left">Role</th>
              <th className="py-3 px-4 border-b text-left">Status</th>
              <th className="py-3 px-4 border-b text-left">Provider</th>
              <th className="py-3 px-4 border-b text-left">Joined Date</th>
              <th className="py-3 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{user.fullname}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.phone || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{user.role || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{user.isActive ? 'Active' : 'Inactive'}</td>
                <td className="py-2 px-4 border-b">{user.provider}</td>
                <td className="py-2 px-4 border-b">{formatDate(user.joinedDate)}</td> {/* Định dạng ngày */}
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4">No users found.</p>
      )}
    </div>
  );
};

export default Users;
