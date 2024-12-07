import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCheckpoint, deleteCheckpoint } from "../redux/checkpointSlice";
import { RootState, AppDispatch } from "../redux/store";
import { AllCheckpoint } from "../types/Checkpoint";
import DetailCheckPointModal from "./DetailCheckPointModal";

const Checkpoints: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { allCheckpoint, loading, error } = useSelector(
    (state: RootState) => state.checkpoint
  );
  const [selectedCheckpoint, setSelectedCheckpoint] = useState("");

  useEffect(() => {
    dispatch(fetchAllCheckpoint());
  }, [dispatch]);

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedCheckpoint("");
    dispatch(fetchAllCheckpoint());
  };

  const handleOpenEditCheckpoint = (id_CheckPoint: string) => {
    setSelectedCheckpoint(id_CheckPoint);
    setShowDetailModal(true);
  };

  const handleDeleteCheckpoint = (id_CheckPoint: string) => {
    dispatch(deleteCheckpoint(id_CheckPoint));
    dispatch(fetchAllCheckpoint());
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Checkpoint Management</h2>
      {loading && <p className="text-gray-600 italic">Loading...</p>}
      {error && (
        <p className="text-red-600">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCheckpoint.length > 0 ? (
          allCheckpoint.map((checkpoint: AllCheckpoint) => (
            <div
              key={checkpoint.id_CheckPoint}
              className="bg-white border border-gray-300 rounded shadow p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-2">
                  {checkpoint.checkpointName}
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>City:</strong> {checkpoint.cityName}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Address:</strong> {checkpoint.address}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Operating Hours:</strong> {checkpoint.operatingHours}
                </p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleOpenEditCheckpoint(checkpoint.id_CheckPoint)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCheckpoint(checkpoint.id_CheckPoint)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">
            No checkpoints found.
          </p>
        )}
      </div>

      {showDetailModal && (
        <DetailCheckPointModal
          showModal={showDetailModal}
          closeModal={handleCloseDetailModal}
          id_CheckPoint={selectedCheckpoint}
          id_TripQuest=""
        />
      )}
    </div>
  );
};

export default Checkpoints;
