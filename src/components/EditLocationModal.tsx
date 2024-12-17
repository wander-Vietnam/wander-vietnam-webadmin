import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCheckpointsByTripquest,
  fetchAvailableCheckpoints,
  addTripQuestLocation,
  deleteTripQuestLocation,
  cleanStoryQuestData,
} from "../redux/checkpointSlice";
import { updateIndex, updateMultipleIndexes } from "../redux/tripquestSlice";
import { RootState, AppDispatch } from "../redux/store";
import AddLocationModal from "./AddLocationModal";
import DetailCheckPointModal from "./DetailCheckPointModal";
import MiniGameModal from "./MiniGameModal";
import StoryModal from "./StoryModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Checkpoint } from "../types/Checkpoint";
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
  const [isStoryOpen, setIsStoryOpen] = React.useState(false);
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
  const [checkpointData, setCheckpointData] = useState<Checkpoint[]>([]);
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
  useEffect(() => {
    setCheckpointData(checkpoints);
  }, [checkpoints]);

  const handleOpenAddLocationModal = () => {
    setShowAddLocationModal(true);
  };
  const handleOnDragEnd = async (result: any) => {
    const { destination, source } = result;
    if (!destination) return; // Nếu không có điểm đến, bỏ qua

    // Cập nhật lại thứ tự của các checkpoint sau khi kéo thả
    const items = Array.from(checkpoints);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    const newIndexes = items.map((item) => item.index);
    console.log("New index order:", newIndexes);
    const payload = {
      id_TripQuest: tripQuestId,
      newIndex: newIndexes,
    };
    setCheckpointData(items);
    console.log("Payload:", payload);
    await dispatch(updateMultipleIndexes(payload));
    dispatch(fetchCheckpointsByTripquest(tripQuestId));
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
  const handleCloseStory = () => {
    dispatch(cleanStoryQuestData());
    setIsStoryOpen(false);
    setCurrentCheckpointId(null);
  };
  const handleMiniGame = (id_CheckPoint: string, id_TripQuest: string) => {
    setCurrentCheckpointId(id_CheckPoint);
    setIsMiniGameOpen(true);
  };
  const handleStory = (id_CheckPoint: string, id_TripQuest: string) => {
    setCurrentCheckpointId(id_CheckPoint);
    setIsStoryOpen(true);
  };

  const handleAddCheckpoint = async (
    id_CheckPoint: string,
    tripQuestId: string
  ) => {
    const id_TripQuest = tripQuestId;
    console.log(id_CheckPoint, tripQuestId);
    try {
      await dispatch(
        addTripQuestLocation({ id_CheckPoint, id_TripQuest })
      ).unwrap();
      dispatch(fetchCheckpointsByTripquest(tripQuestId));
      dispatch(fetchAvailableCheckpoints(tripQuestId));
    } catch (error) {
      console.error("Error adding checkpoint:", error);
    }
  };
  const handleIndexChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    id_CheckPoint: string
  ) => {
    const newIndex = Number(e.target.value); // Lấy giá trị mới từ dropdown

    try {
      // Gọi API để cập nhật index cho checkpoint
      await dispatch(
        updateIndex({ id_TripQuest: tripQuestId, id_CheckPoint, newIndex })
      ).unwrap();

      // Cập nhật lại danh sách checkpoints sau khi thay đổi index thành công
      dispatch(fetchCheckpointsByTripquest(tripQuestId));
    } catch (error) {
      console.error("Error updating index:", error);
    }
  };

  const handleDeleteCheckpoint = async (
    id_CheckPoint: string,
    tripQuestId: string
  ) => {
    const id_TripQuest = tripQuestId;

    try {
      await dispatch(
        deleteTripQuestLocation({ id_CheckPoint, id_TripQuest })
      ).unwrap();
      dispatch(fetchCheckpointsByTripquest(tripQuestId));
      dispatch(fetchAvailableCheckpoints(tripQuestId));
    } catch (error) {
      console.error("Error adding checkpoint:", error);
    }
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

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="checkpoints">
            {(provided) => (
              <div
                className="grid grid-cols-1 gap-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {checkpointData.map((checkpoint, index) => (
                  <Draggable
                    key={checkpoint.id_CheckPoint}
                    draggableId={checkpoint.id_CheckPoint.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="border p-2 rounded shadow"
                      >
                        <h4 className="text-lg font-medium">
                          {checkpoint.checkpointName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {checkpoint.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          Giờ hoạt động: {checkpoint.operatingHours}
                        </p>

                        {/* Dropdown để chọn index */}
                        <div className="text-sm text-gray-600">
                          <label
                            htmlFor={`index-${checkpoint.id_CheckPoint}`}
                            className="block"
                          >
                            Chọn vị trí:
                          </label>
                          <select
                            id={`index-${checkpoint.id_CheckPoint}`}
                            value={checkpoint.index}
                            onChange={(e) =>
                              handleIndexChange(e, checkpoint.id_CheckPoint)
                            }
                            className="border rounded px-2 py-1"
                          >
                            {checkpoint.indexes.map((index: number) => (
                              <option key={index} value={index}>
                                {index}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mt-2 flex space-x-4">
                          <button
                            onClick={() =>
                              handleViewDetails(
                                checkpoint.id_CheckPoint,
                                tripQuestId
                              )
                            }
                            className="text-blue-500 hover:underline text-sm"
                          >
                            Xem chi tiết
                          </button>
                          <button
                            onClick={() =>
                              handleMiniGame(
                                checkpoint.id_CheckPoint,
                                tripQuestId
                              )
                            }
                            className="text-green-500 hover:underline text-sm"
                          >
                            Mini Game
                          </button>
                          <button
                            onClick={() =>
                              handleStory(checkpoint.id_CheckPoint, tripQuestId)
                            }
                            className="text-black-500 hover:underline text-sm"
                          >
                            Câu chuyện
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteCheckpoint(
                                checkpoint.id_CheckPoint,
                                tripQuestId
                              )
                            }
                            className="text-red-500 hover:underline text-sm"
                          >
                            Xoá
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

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

                  <button
                    onClick={() =>
                      handleAddCheckpoint(checkpoint.id_CheckPoint, tripQuestId)
                    }
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
        {isStoryOpen && currentCheckpointId && (
          <StoryModal
            isOpen={isStoryOpen}
            onClose={handleCloseStory}
            checkpointId={currentCheckpointId || ""}
            tripQuestId={tripQuestId}
          />
        )}
      </div>
    </div>
  );
};

export default EditLocationModal;
