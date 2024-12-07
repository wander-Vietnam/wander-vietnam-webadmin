import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProvinces,
  createProvince,
  updateProvince,
  deleteProvince,
} from "../redux/provinceSlice";
import { RootState, AppDispatch } from "../redux/store";
import { Province, NewProvince } from "../types/Province";

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
      const updatedProvince = { ...newProvince, id_city: editingProvince.id_city };
      dispatch(updateProvince({ id: editingProvince.id_city, data: updatedProvince }));
    } else {
      dispatch(createProvince(newProvince));
    }

    dispatch(fetchAllProvinces()); // Fetch updated list

    // Reset form after submission
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
    dispatch(fetchAllProvinces()); // Fetch updated list
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

      <div className="space-y-4">
        {provinces.length > 0 ? (
          provinces.map((province: Province) => (
            <div
              key={province.id_city}
              className="border p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div className="flex-1">
                <h4 className="text-lg font-semibold">{province.cityName}</h4>
                <p className="text-gray-600">{province.isFeatured ? "Featured" : "Not Featured"}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(province)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(province.id_city)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No provinces found.</p>
        )}
      </div>
    </div>
  );
};

export default Provinces;
