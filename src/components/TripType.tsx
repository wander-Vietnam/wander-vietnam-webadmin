import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllTripTypes,
  createTripType,
  deleteTripType,
} from "../redux/tripTypesSlice";
import { RootState, AppDispatch } from "../redux/store";
import { TripType } from "../types/TripType";

const TripTypes: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { tripTypes, loadingTriptype, errorTriptype, creating } = useSelector(
    (state: RootState) => state.tripTypes
  );

  const [newTripType, setNewTripType] = useState<string>("");

  // Fetch all trip types on component mount
  useEffect(() => {
    dispatch(fetchAllTripTypes());
  }, [dispatch]);

  // Handle create trip type
  const handleCreateTripType = () => {
    if (newTripType.trim()) {
      dispatch(createTripType(newTripType.trim()));
      setNewTripType("");
    }
  };

  // Handle delete trip type
  const handleDelete = (id_tripType: string) => {
    dispatch(deleteTripType(id_tripType));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Trip Type Management</h2>

      {/* Loading State */}
      {loadingTriptype && <p className="text-gray-600 italic">Loading...</p>}

      {/* Error State */}
      {errorTriptype && (
        <p className="text-red-600">
          {typeof errorTriptype === "string"
            ? errorTriptype
            : JSON.stringify(errorTriptype)}
        </p>
      )}

      {/* Create Trip Type Form */}
      <div className="flex items-center mb-6">
        <input
          type="text"
          value={newTripType}
          onChange={(e) => setNewTripType(e.target.value)}
          className="flex-1 border border-gray-300 px-4 py-2 rounded-md"
          placeholder="Enter a new trip type"
        />
        <button
          onClick={handleCreateTripType}
          disabled={creating}
          className={`ml-2 px-4 py-2 rounded-md ${
            creating
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {creating ? "Creating..." : "Create"}
        </button>
      </div>

      {/* Trip Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tripTypes.length > 0 ? (
          tripTypes.map((tripType: TripType) => (
            <div
              key={tripType.id_TripType}
              className="bg-white border border-gray-300 rounded shadow p-4 flex flex-col justify-between"
            >
              <h3 className="text-lg font-bold text-blue-600 mb-2">
                {tripType.tripTypeName}
              </h3>
              <button
  onClick={() => handleDelete(tripType.id_TripType)}
  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 mt-4"
>
  Delete
</button>

            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">
            No trip types found.
          </p>
        )}
      </div>
    </div>
  );
};

export default TripTypes;
