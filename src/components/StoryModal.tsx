import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStoryQuestByIds } from "../redux/checkpointSlice"; // Import the action

import { AppDispatch, RootState } from "../redux/store";

interface MiniGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkpointId: string;
  tripQuestId: string;
}

const StoryModal: React.FC<MiniGameModalProps> = ({
  isOpen,
  onClose,
  checkpointId,
  tripQuestId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Get story quest data from Redux store
  const { storyQuestData, loading, error } = useSelector(
    (state: RootState) => state.checkpoint
  );

  useEffect(() => {
    if (!storyQuestData && isOpen) { 
      dispatch(
        getStoryQuestByIds({
          id_TripQuest: tripQuestId,
          id_CheckPoint: checkpointId,
        })
      );
    }
  }, [dispatch, tripQuestId, checkpointId, isOpen, storyQuestData]);
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-3xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 focus:outline-none"
          aria-label="Đóng modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <div>
            {/* Display storyQuest data */}
            <h2 className="text-xl font-semibold">Story Quest Details</h2>
            <p>
              {storyQuestData?.storyQuest || "No story quest available"}
            </p>{" "}
            {/* Display the storyQuest */}
            {storyQuestData?.link_StoryQuest ? (
              <div>
                <a
                  href={storyQuestData.link_StoryQuest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  View Story Quest Link
                </a>
              </div>
            ) : (
              <p>No link available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryModal;
