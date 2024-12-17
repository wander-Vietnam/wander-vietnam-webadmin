import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, deleteUser } from "../redux/userSlice";
import { RootState, AppDispatch } from "../redux/store";

const Users: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );

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
    return date.toISOString().split("T")[0]; // Trả về định dạng yyyy-mm-dd
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {loading && <p className="text-gray-600 italic">Loading...</p>}
      {error && (
        <p className="text-red-600">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </p>
      )}

      {users.length > 0 ? (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-gray-300 p-4 rounded-lg shadow-sm hover:bg-gray-100 relative"
            >
              {/* Delete Button centered vertically in the right */}
              <button
                onClick={() => handleDelete(user.id)}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <div className="grid grid-cols-3 gap-6">
                {/* Avatar */}
                {user.avatar ? (
                  <div className="flex justify-center items-center">
                    <img
                      src={user.avatar}
                      alt={`${user.fullname}`}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex justify-center items-center">
                    <img
                      src="/src/assets/images/user.png"
                      alt="Default Avatar"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  {/* User Info */}
                  <h4 className="text-xl font-semibold text-gray-800">
                    {user.fullname}
                  </h4>
                  <p className="text-gray-600">Email: {user.email}</p>
                  <p className="text-gray-600">
                    Phone: {user.phone || "Chưa có"}
                  </p>
                  <p className="text-gray-600">Role: {user.role || "N/A"}</p>
                  <p className="text-gray-600">
                    Status: {user.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="space-y-2">
                  {/* Additional User Info */}
                  <p className="text-gray-600">Provider: {user.provider}</p>
                  <p className="text-gray-600">
                    Joined Date: {formatDate(user.joinedDate)}
                  </p>
                  <p className="text-gray-600">
                    Rank Points: {user.rankPoints}
                  </p>
                  <p className="text-gray-600">
                    Total Rank Points: {user.totalRankPoints}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-600">No users found.</p>
      )}
    </div>
  );
};

export default Users;
