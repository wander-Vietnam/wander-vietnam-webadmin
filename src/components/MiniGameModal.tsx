import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestionsByTripAndCheckpoint } from "../redux/quizzSlice";
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

  // Lấy dữ liệu câu hỏi từ Redux store
  const { questions, loading, error } = useSelector(
    (state: RootState) => state.quizz
  );
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = React.useState(false);

  const onAddQuestion = () => {
    setIsAddQuestionModalOpen(true);
  };

  const onCloseAddQuestionModal = () => {
    setIsAddQuestionModalOpen(false);
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
  const onDeleteQuestion = () => {};
  // Nếu đang load dữ liệu hoặc có lỗi
  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-3xl">
        {/* Nút thêm câu hỏi */}
        <button
          onClick={onAddQuestion}
          className="absolute top-3 right-20 flex items-center bg-blue-600 text-white hover:bg-blue-700 focus:outline-none px-4 py-2 rounded-md"
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

        <h2 className="text-xl font-bold mb-4">Danh sách câu hỏi:</h2>
        <div className="max-h-96 overflow-y-auto">
          {questions && questions.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {questions.map((question) => (
                <div
                  key={question.id_Question}
                  className="p-4 border rounded-lg shadow-sm relative"
                >
                  <h4 className="text-lg font-medium">
                    {question.questionText}
                  </h4>
                  <p>
                    <strong>Điểm:</strong> {question.points}
                  </p>
                  <p>
                    <strong>Loại câu hỏi:</strong> {question.questionType}
                  </p>
                  {question.correctAnswers &&
                    question.correctAnswers.length > 0 && (
                      <div>
                        <h5 className="font-semibold mt-2">
                          Câu trả lời đúng:
                        </h5>
                        <ul className="list-disc pl-5">
                          {question.correctAnswers.map((answer, index) => (
                            <li key={index}>{answer}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Hiển thị câu trả lời sai nếu có */}
                  {question.wrongAnswers &&
                    question.wrongAnswers.length > 0 && (
                      <div>
                        <h5 className="font-semibold mt-2">Câu trả lời sai:</h5>
                        <ul className="list-disc pl-5">
                          {question.wrongAnswers.map((answer, index) => (
                            <li key={index}>{answer}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Nút sửa và xoá */}
                  <div className="absolute bottom-3 right-3 flex space-x-2">
                    <button
                      //   onClick={() => onEditQuestion(question.id_Question)}
                      className="text-blue-600 hover:text-blue-800 focus:outline-none"
                      aria-label="Sửa câu hỏi"
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
                          d="M12 20h9M15 3l4 4-9 9-4-4L15 3z"
                        />
                      </svg>
                    </button>
                    <button
                      //   onClick={() => onDeleteQuestion(question.id_Question)}
                      className="text-red-600 hover:text-red-800 focus:outline-none"
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
          ) : (
            <p>Không có câu hỏi.</p>
          )}
        </div>
      </div>
      <AddQuestionModal
        isOpen={isAddQuestionModalOpen}
        onClose={onCloseAddQuestionModal}
        checkpointId={checkpointId}
        tripQuestId={tripQuestId}
      />
    </div>
  );
};

export default MiniGameModal;
