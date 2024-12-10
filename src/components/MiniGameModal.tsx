import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestionsByTripAndCheckpoint,
  deleteQuestion,
} from "../redux/quizzSlice";
import { AppDispatch, RootState } from "../redux/store";
import AddQuestionModal from "./AddQuestionModal";

interface MiniGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkpointId: string;
  tripQuestId: string;
}

const MiniGameModal: React.FC<MiniGameModalProps> = ({
  isOpen,
  onClose,
  checkpointId,
  tripQuestId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { questions, loading, error } = useSelector(
    (state: RootState) => state.quizz
  );
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] =
    React.useState(false);

  const onAddQuestion = () => {
    setIsAddQuestionModalOpen(true);
  };

  const onCloseAddQuestionModal = () => {
    setIsAddQuestionModalOpen(false);
  };
  const onDeleteQuestion = async (id_Question: string) => {
    await dispatch(deleteQuestion(id_Question));
    dispatch(
      fetchQuestionsByTripAndCheckpoint({
        id_TripQuest: tripQuestId,
        id_CheckPoint: checkpointId,
      })
    );
  };
  useEffect(() => {
    if (isOpen) {
      dispatch(
        fetchQuestionsByTripAndCheckpoint({
          id_TripQuest: tripQuestId,
          id_CheckPoint: checkpointId,
        })
      );
    }
  }, [isOpen, tripQuestId, checkpointId, dispatch]);
  const onCreate = () => {
    dispatch(
      fetchQuestionsByTripAndCheckpoint({
        id_TripQuest: tripQuestId,
        id_CheckPoint: checkpointId,
      })
    );
  };
  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-2xl p-6 w-3/4 max-w-3xl">
        {/* Nút thêm câu hỏi */}
        <button
          onClick={onAddQuestion}
          className="absolute top-3 right-20 flex items-center bg-blue-600 text-white hover:bg-blue-700 focus:outline-none px-4 py-2 rounded-md transition-all"
          aria-label="Thêm câu hỏi"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14m7-7H5"
            />
          </svg>
          <h3 className="text-sm font-medium">Thêm câu hỏi</h3>
        </button>

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

        <h2 className="text-xl font-bold mb-6">Danh sách câu hỏi:</h2>
        <div className="max-h-96 overflow-y-auto">
          {questions.map((question) => (
            <div
              key={question.id_Question}
              className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 border rounded-xl shadow-lg hover:shadow-2xl transition-all relative mb-2"
            >
              <h4 className="text-lg font-semibold text-blue-700">
                {question.questionText}
              </h4>
              <p className="text-sm mt-2">
                <strong>Điểm:</strong> {question.points}
              </p>
              <p className="text-sm">
                <strong>Loại câu hỏi:</strong> {question.questionType}
              </p>

              {question.correctAnswers &&
                question.correctAnswers.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-semibold">Câu trả lời đúng:</h5>
                    <div className="flex flex-wrap space-x-2">
                      {question.correctAnswers.map((answer, index) => (
                        <span
                          key={index}
                          className="bg-green-200 text-green-800 py-1 px-3 rounded-full text-sm"
                        >
                          {answer}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {question.wrongAnswers && question.wrongAnswers.length > 0 && (
                <div className="mt-4 mb-2">
                  <h5 className="font-semibold">Câu trả lời sai:</h5>
                  <div className="flex flex-wrap space-x-2">
                    {question.wrongAnswers.map((answer, index) => (
                      <span
                        key={index}
                        className="bg-red-200 text-red-800 py-1 px-3 rounded-full text-sm mb-2"
                      >
                        {answer}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nút xóa */}
              <div className="absolute bottom-3 right-3 flex space-x-2">
                <button
                  onClick={() => onDeleteQuestion(question.id_Question)}
                  className="bg-red-600 text-white hover:bg-red-700 rounded-md p-2 focus:outline-none"
                  aria-label="Xoá câu hỏi"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddQuestionModal
        isOpen={isAddQuestionModalOpen}
        onClose={onCloseAddQuestionModal}
        onCreate={onCreate}
        checkpointId={checkpointId}
        tripQuestId={tripQuestId}
      />
    </div>
  );
};

export default MiniGameModal;
