import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStoryQuestByIds } from "../redux/checkpointSlice";
import { createTextToSpeech } from "../redux/textToSpeechSlice";
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

  const { storyQuestData, loading, error } = useSelector(
    (state: RootState) => state.checkpoint
  );

  const [storyQuestInput, setStoryQuestInput] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
    setSuccessMessage(null); // Hide success message when the user starts typing
  };

  const handleSubmit = () => {
    const updatedData = {
      id_TripQuest: tripQuestId,
      id_CheckPoint: checkpointId,
      storyQuest: storyQuestInput,
    };

    setIsSubmitting(true); // Start the loading process

    dispatch(createTextToSpeech(updatedData)) // Call the API to update the story quest
      .then(() => {
        setSuccessMessage("Story quest updated successfully!"); // Show success message
        setErrorMessage(null); // Clear any error message
        setTimeout(() => {
          dispatch(
            getStoryQuestByIds({
              id_TripQuest: tripQuestId,
              id_CheckPoint: checkpointId,
            })
          );
          setIsSubmitting(false); // Stop the loading process after 2 seconds
        }, 2000); // Wait for 2 seconds before fetching data again
      })
      .catch(() => {
        setErrorMessage("Failed to update story quest."); // Show error message
        setSuccessMessage(null); // Clear success message if there's an error
        setIsSubmitting(false); // Stop loading if error occurs
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

        {isSubmitting ? (
          <div>Update...</div>
        ) : loading ? (
          <div>Update...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold">Story Quest Details</h2>

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

            {storyQuestData?.link_StoryQuest && (
              <div className="mt-4">
                <label className="block text-gray-700">
                  Play Story Quest Audio:
                </label>
                <audio controls className="w-full mt-2">
                  <source
                    src={storyQuestData.link_StoryQuest}
                    type="audio/mp3"
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryModal;
