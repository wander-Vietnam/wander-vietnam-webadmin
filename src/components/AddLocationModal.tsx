import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCheckPoint } from "../redux/checkpointSlice"; // import action
import { fetchAllCities } from "../redux/citySlice"; // Import action để fetch city
import { ICheckPointCreate } from "../types/Checkpoint";
import { AppDispatch } from "../redux/store";
import { RootState } from "../redux/store";

interface AddLocationModalProps {
  showModal: boolean;
  closeModal: () => void;
}

const AddLocationModal: React.FC<AddLocationModalProps> = ({
  showModal,
  closeModal,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const cities = useSelector((state: RootState) => state.cities.cities); // Lấy danh sách thành phố từ Redux
  const [formData, setFormData] = useState<ICheckPointCreate>({
    latitude: "0",  // Set default value for latitude
    longitude: "0", // Set default value for longitude
    id_City: "",
    checkpointName: "",
    address: "",
    operatingHours: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllCities()); // Fetch danh sách thành phố khi modal mở
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, id_City: e.target.value }); // Lưu ID của thành phố được chọn
  };

  const handleAddCheckpoint = async () => {
    if (
      !formData.checkpointName ||
      !formData.address ||
      !formData.id_City
    ) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // Giữ vĩ độ và kinh độ là "0" khi gửi API
    const checkpointData: ICheckPointCreate = {
      ...formData,
      latitude: "0", // Always set latitude to "0"
      longitude: "0", // Always set longitude to "0"
    };

    try {
      const checkpointId = await dispatch(addCheckPoint({ checkpointData }));
      if (checkpointId) {
        closeModal(); // Đóng modal khi thêm địa điểm thành công
      }
    } catch (error: any) {
      setError(error.message || "Không thể thêm địa điểm.");
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h3 className="text-xl font-semibold mb-4">Thêm địa điểm mới</h3>

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tên địa điểm</label>
          <input
            type="text"
            name="checkpointName"
            value={formData.checkpointName}
            onChange={handleInputChange}
            placeholder="Ví dụ: Trà Vinh"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Ví dụ: Ấp cù lao Cồn Chim, Xã Hòa Minh"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Remove latitude and longitude input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Giờ hoạt động</label>
          <input
            type="text"
            name="operatingHours"
            value={formData.operatingHours || ""}
            onChange={handleInputChange}
            placeholder="Ví dụ: 08:00 - 18:00"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Chọn thành phố</label>
          <select
            name="id_City"
            value={formData.id_City}
            onChange={handleSelectCity}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          >
            <option value="">Chọn thành phố</option>
            {cities.map((city) => (
              <option key={city.id_city} value={city.id_city}>
                {city.cityName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleAddCheckpoint}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Thêm địa điểm
          </button>
          <button
            onClick={closeModal}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLocationModal;
