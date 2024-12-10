import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStoryQuestByIds } from "../redux/checkpointSlice"; // Import the action
import { createTextToSpeech } from "../redux/textToSpeechSlice"; // Import the action to update text-to-speech

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

  const [storyQuestInput, setStoryQuestInput] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  useEffect(() => {
    if (storyQuestData) {
      setStoryQuestInput(storyQuestData.storyQuest || "");
    }
  }, [storyQuestData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoryQuestInput(e.target.value);
    // Hide the success message when the user starts typing
    setSuccessMessage(null);
  };

  const handleSubmit = () => {
    const updatedData = {
      id_TripQuest: tripQuestId,
      id_CheckPoint: checkpointId,
      storyQuest: storyQuestInput,
    };

    dispatch(createTextToSpeech(updatedData)) // Call the API to update the story quest
      .then(() => {
        setSuccessMessage("Story quest updated successfully!"); // Show success message
        setErrorMessage(null); // Clear any error message
      })
      .catch(() => {
        setErrorMessage("Failed to update story quest."); // Show error message
        setSuccessMessage(null); // Clear success message if there's an error
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-3xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 focus:outline-none"
          aria-label="Close modal"
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

            {/* Display and allow editing of storyQuest */}
            <div className="mb-4">
              <label htmlFor="storyQuest" className="block text-gray-700">
                Story Quest:
              </label>
              <input
                type="text"
                id="storyQuest"
                value={storyQuestInput}
                onChange={handleInputChange}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Edit story quest"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>

            {/* Display success or error message */}
            {successMessage && (
              <div className="mt-4 text-green-500 bg-green-100 p-2 rounded-md">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mt-4 text-red-500 bg-red-100 p-2 rounded-md">
                {errorMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryModal;
