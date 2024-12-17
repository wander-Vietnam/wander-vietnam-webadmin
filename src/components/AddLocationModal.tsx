import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCheckPoint } from "../redux/checkpointSlice";
import { fetchAllCities } from "../redux/citySlice";
import { ICheckPointCreate } from "../types/Checkpoint";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AppDispatch } from "../redux/store";
import { RootState } from "../redux/store";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface AddLocationModalProps {
  showModal: boolean;
  closeModal: () => void;
  onAddCheckpointSuccess: () => void; 
}

const AddLocationModal: React.FC<AddLocationModalProps> = ({
  showModal,
  closeModal,
  onAddCheckpointSuccess
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const cities = useSelector((state: RootState) => state.cities.cities);
  const [formData, setFormData] = useState<ICheckPointCreate>({
    latitude: "0",
    longitude: "0",
    id_City: "",
    checkpointName: "",
    address: "",
    operatingHours: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isFetchingCoordinates, setIsFetchingCoordinates] = useState(false);

  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    dispatch(fetchAllCities()); // Fetch cities when modal opens
  }, [dispatch]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "address" && value.trim() !== "") {
      setIsFetchingCoordinates(true);
      try {
        const coordinates = await fetchCoordinates(value);
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

    if (data.results && data.results.length > 0) {
      return data.results[0].geometry.location;
    }
    throw new Error("No valid results found");
  };

  const handleSelectCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, id_City: e.target.value });
  };

  const handleAddCheckpoint = async () => {
    if (!formData.checkpointName || !formData.address || !formData.id_City) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const checkpointId = await dispatch(
        addCheckPoint({ checkpointData: formData })
      );
      if (checkpointId) {
        closeModal();
        onAddCheckpointSuccess();
      }
    } catch (error: any) {
      setError(error.message || "Error adding checkpoint.");
    }
  };
  const lat = parseFloat(formData.latitude);
  const lng = parseFloat(formData.longitude);
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], mapRef.current.getZoom()); 
    }
  }, [lat, lng]);
  


  if (!showModal) return null;



  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h3 className="text-xl font-semibold mb-4">Add New Location</h3>

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Location Name
          </label>
          <input
            type="text"
            name="checkpointName"
            value={formData.checkpointName}
            onChange={handleInputChange}
            placeholder="e.g., Trà Vinh"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="e.g., Ấp cù lao Cồn Chim, Xã Hòa Minh"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
          {isFetchingCoordinates && (
            <div className="text-sm text-gray-500 mt-2">Fetching coordinates...</div>
          )}
        </div>

        <div className="mb-4">
          <MapContainer
            center={[lat, lng]} // Set map center to new coordinates
            zoom={13}
            style={{ height: "300px", width: "100%" }}
            whenReady={() => {
              if (mapRef.current) {
                mapRef.current.setView([lat, lng], mapRef.current.getZoom()); // Update map view after ready
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
            Operating Hours
          </label>
          <input
            type="text"
            name="operatingHours"
            value={formData.operatingHours || ""}
            onChange={handleInputChange}
            placeholder="e.g., 08:00 - 18:00"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select City
          </label>
          <select
            name="id_City"
            value={formData.id_City}
            onChange={handleSelectCity}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          >
            <option value="">Select City</option>
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
            Add Location
          </button>
          <button
            onClick={closeModal}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLocationModal;
