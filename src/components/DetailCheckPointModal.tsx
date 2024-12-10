import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCheckpointById,
  updateCheckpoint,
} from "../redux/checkpointSlice";
import { RootState, AppDispatch } from "../redux/store";
import { fetchAllCities } from "../redux/citySlice";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
interface DetailCheckPointModalProps {
  showModal: boolean;
  closeModal: () => void;
  id_CheckPoint: string;
  id_TripQuest: string;
}
const DetailCheckPointModal: React.FC<DetailCheckPointModalProps> = ({
  showModal,
  closeModal,
  id_CheckPoint,
  id_TripQuest,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isFetchingCoordinates, setIsFetchingCoordinates] = useState(false);

  const { loading, error, checkpointDetail } = useSelector(
    (state: RootState) => state.checkpoint
  );
  const { questions } = useSelector((state: RootState) => state.quizz);
  const cities = useSelector((state: RootState) => state.cities.cities);
  const [formData, setFormData] = useState({
    longitude: "",
    latitude: "",
    id_City: "",
    checkpointName: "",
    address: "",
    operatingHours: "",
  });
  const mapRef = useRef<L.Map | null>(null);
  useEffect(() => {
    if (id_CheckPoint && showModal) {
      dispatch(fetchCheckpointById(id_CheckPoint));
    }
  }, [id_CheckPoint, showModal, dispatch]);
  useEffect(() => {
    if (checkpointDetail) {
      setFormData({
        latitude: checkpointDetail.latitude,
        longitude: checkpointDetail.longitude,
        id_City: checkpointDetail.id_City,
        checkpointName: checkpointDetail.checkpointName,
        address: checkpointDetail.address,
        operatingHours: checkpointDetail.operatingHours,
      });
    }
  }, [checkpointDetail]);
  useEffect(() => {
    if (showModal) {
      dispatch(fetchAllCities());
    }
  }, [dispatch, showModal]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  let lat = parseFloat(checkpointDetail?.latitude ?? formData.latitude);
  let lng = parseFloat(checkpointDetail?.longitude ?? formData.longitude);
  const handleInputChangeAddress = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "address" && value.trim() !== "") {
      setIsFetchingCoordinates(true);
      try {
        const coordinates = await fetchCoordinates(value);
        lat = parseFloat(coordinates.lat);
        lng = parseFloat(coordinates.lng);
        if (coordinates) {
          setFormData({
            ...formData,
            address: value,
            latitude: coordinates.lat.toString(),
            longitude: coordinates.lng.toString(),
          });
        }
      } catch (err) {
        console.error("Error fetching coordinates:", err);
      } finally {
        setIsFetchingCoordinates(false);
      }
    }
  };

  const fetchCoordinates = async (address: string) => {
    const API_KEY = "T7MEMQkbw8MA3OvaRcM5rvZb8pHV5BKJjfnpDlhU";
    const url = `https://rsapi.goong.io/Geocode?address=${encodeURIComponent(
      address
    )}&api_key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Unable to fetch coordinates");
    }
    const data = await response.json();
    console.log(JSON.stringify(data));
    if (data.results && data.results.length > 0) {
      return data.results[0].geometry.location;
    }
    throw new Error("No valid results found");
  };

  const handleSelectCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, id_City: value }));
  };
  const handleUpdateCheckpoint = async () => {
    try {
      await dispatch(
        updateCheckpoint({ id: id_CheckPoint, checkpointData: formData })
      );
      console.log("Cập nhật thành công!");
      closeModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], mapRef.current.getZoom());
    }
  }, [lat, lng]);
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg transform transition-all duration-300 ease-in-out">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Chi tiết địa điểm
        </h3>
        {loading && <p className="text-blue-500">Đang tải...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {checkpointDetail ? (
          <div className="space-y-3">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Tên địa điểm
              </label>
              <input
                type="text"
                name="checkpointName"
                value={formData.checkpointName}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChangeAddress}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <MapContainer
                center={[lat, lng]} // Set map center to new coordinates
                zoom={13}
                style={{ height: "300px", width: "100%" }}
                whenReady={() => {
                  if (mapRef.current) {
                    mapRef.current.setView(
                      [lat, lng],
                      mapRef.current.getZoom()
                    ); // Update map view after ready
                  }
                }}
                ref={mapRef}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]}>
                  <Popup>{formData.address || "No address available"}</Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Giờ hoạt động
              </label>
              <input
                type="text"
                name="operatingHours"
                value={formData.operatingHours}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Chọn thành phố
              </label>
              <select
                name="id_City"
                value={formData.id_City}
                onChange={handleSelectCity}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              >
                {cities &&
                  cities.map((city) => (
                    <option key={city.id_city} value={city.id_city}>
                      {city.cityName}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleUpdateCheckpoint}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Cập nhật địa điểm
              </button>
              <button
                onClick={closeModal}
                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          !loading && (
            <p className="text-gray-500">Không tìm thấy dữ liệu CheckPoint.</p>
          )
        )}
      </div>
    </div>
  );
};

export default DetailCheckPointModal;
