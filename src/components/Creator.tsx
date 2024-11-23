import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTripquestCards } from "../redux/tripquestSlice";
import { AppDispatch } from "../redux/store";
import Create from "./Create";
import EditLocationModal from "./EditLocationModal";

const Creator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cards, loading, error } = useSelector((state: any) => state.tripquest);  // Select tripquest data
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedTripQuestId, setSelectedTripQuestId] = React.useState<string | null>(null);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openEditModal = (id: string) => {
    setSelectedTripQuestId(id);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  useEffect(() => {
    dispatch(fetchTripquestCards()); 
  }, [dispatch]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN').format(Number(price)); // Định dạng theo chuẩn Việt Nam
  };

  // Hàm kiểm tra xem checkpoint có hợp lệ không
  const isValidCheckpoint = (checkpoint: any) => {
    return checkpoint.checkpointName && checkpoint.address;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={openCreateModal}
          aria-label="Mở modal tạo mới"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Tạo
        </button>
      </div>

      {/* Conditionally render Create modal */}
      {isCreateModalOpen && <Create closeModal={closeCreateModal} />}

      {/* Conditionally render Edit modal */}
      {isEditModalOpen && selectedTripQuestId && (
        <EditLocationModal 
          tripQuestId={selectedTripQuestId} 
          closeModal={closeEditModal} 
        />
      )}

      {/* Display loading, error or cards */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Danh sách các Quest</h2>
          <ul className="space-y-6">
            {cards.map((card: any) => (
              <li key={card.id_TripQuest} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="flex-none w-full md:w-1/3">
                    <img 
                      src={card.imageUrl[0]} 
                      alt={card.tripQuestName} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 md:w-2/3">
                    <h3 className="text-xl font-semibold text-blue-600">{card.tripQuestName}</h3>
                    <p className="mt-2 text-gray-600">{card.description}</p>
                    <div className="mt-4">
                      <span className="inline-block px-3 py-1 text-sm bg-green-500 text-white rounded-full">{formatPrice(card.price)} VND</span>
                      <span className={`inline-block ml-2 px-3 py-1 text-sm ${card.isForTeamBuilding ? 'bg-orange-500' : 'bg-gray-400'} text-white rounded-full`}>
                        {card.isForTeamBuilding ? 'Team Building' : 'Personal'}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-lg font-medium">Nổi bật:</h4>
                      <ul className="list-disc pl-5 text-gray-700">
                        {card.highlights.map((highlight: string, index: number) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      <p><strong>Bắt đầu:</strong> {card.startTime}</p>
                      <p><strong>Kết thúc:</strong> {card.endTime}</p>
                    </div>

                    {/* Display checkpoints */}
                    <div className="mt-4">
                      <h4 className="text-lg font-medium">Các địa điểm:</h4>
                      {card.checkpoints && card.checkpoints.some(isValidCheckpoint) ? (
                        <ul className="list-disc pl-5 text-gray-700">
                          {card.checkpoints.map((checkpoint: any, index: number) => (
                            isValidCheckpoint(checkpoint) ? (
                              <li key={index}>
                                <strong>{checkpoint.checkpointName}</strong> - {checkpoint.address}
                              </li>
                            ) : (
                              <li key={index}>-</li>
                            )
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Chưa có điểm nào</p>
                      )}
                    </div>

                    {/* Edit location button */}
                    <div className="mt-4">
                      <button
                        onClick={() => openEditModal(card.id_TripQuest)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                      >
                        Chỉnh sửa địa điểm
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Creator;
