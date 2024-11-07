import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProvinces,
  createProvince,
  updateProvince,
  deleteProvince,
} from "../redux/provinceSlice";
import { RootState, AppDispatch } from "../redux/store";
import { NewProvince, Province } from "../types/Province";

const Provinces: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { provinces, loading, error } = useSelector(
    (state: RootState) => state.provinces
  );

  const [newProvince, setNewProvince] = useState<NewProvince>({
    cityName: "",
    isFeatured: false,
  });

  const [editingProvince, setEditingProvince] = useState<Province | null>(null);

  useEffect(() => {
    dispatch(fetchAllProvinces());
  }, [dispatch]);

  const handleAddOrEdit = () => {
    if (!newProvince.cityName) {
      alert("City name is required!");
      return;
    }

    if (editingProvince) {
      console.log(newProvince);
      const updatedProvince = { ...newProvince, id_city: editingProvince.id_city };
      dispatch(updateProvince({ id: editingProvince.id_city, data: updatedProvince }));
    } else {
      // Create a new province without id_city
      dispatch(createProvince(newProvince));
    }

    // Fetch the updated list of provinces
    dispatch(fetchAllProvinces());

    // Reset the form after submission
    setNewProvince({ cityName: "", isFeatured: false });
    setEditingProvince(null);
  };

  const handleEdit = (province: Province) => {
    setEditingProvince(province);
    setNewProvince({ cityName: province.cityName, isFeatured: province.isFeatured });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProvince((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProvince((prevState) => ({
      ...prevState,
      isFeatured: e.target.checked,
    }));
  };

  const handleDelete = (id_city: string) => {
    dispatch(deleteProvince(id_city));
    // Fetch the updated list of provinces after delete
    dispatch(fetchAllProvinces());
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Province Management</h2>
      {loading && <p className="text-gray-600 italic">Loading...</p>}
      {error && (
        <p className="text-red-600">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </p>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-semibold">
          {editingProvince ? "Edit Province" : "Add New Province"}
        </h3>
        <div className="space-y-4">
          {/* No input for id_city */}
          <input
            type="text"
            name="cityName"
            value={newProvince.cityName}
            onChange={handleInputChange}
            placeholder="City Name"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <div>
            <label>
              <input
                type="checkbox"
                checked={newProvince.isFeatured}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              Featured
            </label>
          </div>
          <button
            onClick={handleAddOrEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingProvince ? "Update Province" : "Add Province"}
          </button>
        </div>
      </div>

      {provinces.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 border-b text-left">City ID</th>
              <th className="py-3 px-4 border-b text-left">City Name</th>
              <th className="py-3 px-4 border-b text-left">Featured</th>
              <th className="py-3 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {provinces.map((province: Province) => (
              <tr key={province.id_city} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{province.id_city}</td>
                <td className="py-2 px-4 border-b">{province.cityName}</td>
                <td className="py-2 px-4 border-b">
                  {province.isFeatured ? "Yes" : "No"}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEdit(province)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(province.id_city)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4">No provinces found.</p>
      )}
    </div>
  );
};

export default Provinces;
