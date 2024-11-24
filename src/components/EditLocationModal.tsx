import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCheckpointsByTripquest,
  fetchAvailableCheckpoints,
} from "../redux/checkpointSlice";
import { RootState, AppDispatch } from "../redux/store";
import AddLocationModal from "./AddLocationModal";
import DetailCheckPointModal from "./DetailCheckPointModal";
import MiniGameModal from "./MiniGameModal";

interface EditLocationModalProps {
  closeModal: () => void;
  tripQuestId: string;
}

const EditLocationModal: React.FC<EditLocationModalProps> = ({
  closeModal,
  tripQuestId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isMiniGameOpen, setIsMiniGameOpen] = React.useState(false);
  const [currentCheckpointId, setCurrentCheckpointId] = React.useState<
    string | null
  >(null);

  const [selectedCheckpoint, setSelectedCheckpoint] = useState<{
    id_CheckPoint: string;
    id_TripQuest: string;
  } | null>(null);
  const { checkpoints, availableCheckpoints, loading, error } = useSelector(
    (state: RootState) => state.checkpoint
  );
  const [showAvailableCheckpoints, setShowAvailableCheckpoints] =
    useState(false);
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);

  useEffect(() => {
    if (tripQuestId) {
      dispatch(fetchCheckpointsByTripquest(tripQuestId));
    }
    dispatch(fetchAvailableCheckpoints(tripQuestId));
    setShowAvailableCheckpoints(true);
  }, [dispatch, tripQuestId]);

  const handleOpenAddLocationModal = () => {
    setShowAddLocationModal(true);
  };

  const handleCloseAddLocationModal = () => {
    setShowAddLocationModal(false);
  };
  const handleViewDetails = (id_CheckPoint: string, id_TripQuest: string) => {
    setSelectedCheckpoint({ id_CheckPoint, id_TripQuest });
    setShowDetailModal(true);
  };
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedCheckpoint(null);
    if (tripQuestId) {
      dispatch(fetchAvailableCheckpoints(tripQuestId));
    }
  };
  const handleCloseMiniGame = () => {
    setIsMiniGameOpen(false);
    setCurrentCheckpointId(null);
  };
  const handleMiniGame = (id_CheckPoint: string, id_TripQuest: string) => {
    setCurrentCheckpointId(id_CheckPoint);
    setIsMiniGameOpen(true);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Đang tải...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Có lỗi xảy ra: {error}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl h-3/4 overflow-y-auto relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Đóng modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h3 className="text-xl font-semibold mb-4">Danh sách địa điểm</h3>

        {/* Danh sách các checkpoints hiện tại */}
        {checkpoints.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {checkpoints.map((checkpoint) => (
              <div
                key={checkpoint.id_CheckPoint}
                className="border p-2 rounded shadow"
              >
                <h4 className="text-lg font-medium">
                  {checkpoint.checkpointName}
                </h4>
                <p className="text-sm text-gray-600">{checkpoint.address}</p>
                <p className="text-sm text-gray-600">
                  Giờ hoạt động: {checkpoint.operatingHours}
                </p>
                <div className="mt-2 flex space-x-4">
                  <button
                    onClick={() =>
                      handleViewDetails(checkpoint.id_CheckPoint, tripQuestId)
                    }
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Xem chi tiết
                  </button>

                  {/* Nút Mini Game */}
                  <button
                    onClick={() =>
                      handleMiniGame(checkpoint.id_CheckPoint, tripQuestId)
                    }
                    className="text-green-500 hover:underline text-sm"
                  >
                    Mini Game
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Không có địa điểm nào.
          </div>
        )}

        {/* Nút "Thêm địa điểm"
        <div className="flex justify-end mt-4">
          <button
            onClick={handleAddNewLocation}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            aria-label="Thêm địa điểm"
          >
            Các địa điểm hiện có
          </button>
        </div> */}

        {showAvailableCheckpoints && availableCheckpoints.length > 0 && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">
              Danh sách địa điểm có sẵn:
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {availableCheckpoints.map((checkpoint) => (
                <div
                  key={checkpoint.id_CheckPoint}
                  className="border p-2 rounded shadow flex flex-col relative"
                >
                  <h4 className="text-lg font-medium">
                    {checkpoint.checkpointName}
                  </h4>
                  <p className="text-sm text-gray-600">{checkpoint.address}</p>
                  <p className="text-sm text-gray-600">
                    Giờ hoạt động: {checkpoint.operatingHours}
                  </p>

                  {/* Nút "Xem chi tiết" */}
                  <div className="mt-2 flex space-x-4">
                    <button
                      onClick={() =>
                        handleViewDetails(checkpoint.id_CheckPoint, tripQuestId)
                      }
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Xem chi tiết
                    </button>
                  </div>

                  {/* Nút "Thêm vào chuyến đi" ở góc phải dưới */}
                  <button
                    // onClick={() =>
                    //   // handleAddToTrip(checkpoint.id_CheckPoint, tripQuestId)
                    // }
                    className="absolute bottom-3 right-3 bg-green-500 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Thêm vào chuyến đi
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nút "Thêm địa điểm mới" - Mở modal */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleOpenAddLocationModal}
            className="px-6 py-3 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
            aria-label="Thêm địa điểm mới"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v14M5 12h14"
              />
            </svg>
          </button>
        </div>

        {/* Modal thêm địa điểm mới */}
        <AddLocationModal
          showModal={showAddLocationModal}
          closeModal={handleCloseAddLocationModal}
        />

        {showDetailModal && selectedCheckpoint !== null && (
          <DetailCheckPointModal
            showModal={showDetailModal}
            closeModal={handleCloseDetailModal}
            id_CheckPoint={selectedCheckpoint.id_CheckPoint}
            id_TripQuest={selectedCheckpoint.id_TripQuest}
          />
        )}

        {isMiniGameOpen && currentCheckpointId && (
          <MiniGameModal
            isOpen={isMiniGameOpen}
            onClose={handleCloseMiniGame}
            checkpointId={currentCheckpointId || ""}
            tripQuestId={tripQuestId}
          />
        )}
      </div>
    </div>
  );
};

export default EditLocationModal;
