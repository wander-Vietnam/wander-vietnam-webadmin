import React, { useState } from "react";
import { createQuestion } from "../redux/quizzSlice";
import { useDispatch } from "react-redux";
import { IQuestion } from "../types/Province";
import { AppDispatch } from "../redux/store";

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkpointId: string;
  tripQuestId: string;
  onCreate: () => void;
}

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  onClose,
  checkpointId,
  tripQuestId,
  onCreate,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [questionText, setQuestionText] = useState("");
  const [points, setPoints] = useState(0);
  const [questionType, setQuestionType] = useState<
    "multiple_choice" | "open_answer" | "true_false" | "sort"
  >("multiple_choice");
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
const [wrongAnswerInput, setWrongAnswerInput] = useState<string>("");
const [sortAnswerInput, setSortAnswerInput] = useState<string>("");
let updatedCorrectAnswers = correctAnswers;
  const onAdd = async () => {
    console.log("correctAnswers",correctAnswers)
    if (questionType === "true_false" && correctAnswers.length === 0) {
      console.log("correctAnswers set to Đúng");
      updatedCorrectAnswers = ["Đúng"];
      setCorrectAnswers(updatedCorrectAnswers);
    }
    const newQuestion: IQuestion = {
      id_Question: "generated_id",
      questionText,
      questionType,
      correctAnswers: updatedCorrectAnswers,
      wrongAnswers,
      points,
      id_CheckPoint: checkpointId,
      id_TripQuest: tripQuestId,
    };

    try {
      await dispatch(createQuestion(newQuestion));
      onClose();
      onCreate();
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };
  const handleAddWrongAnswer = () => {
    if (wrongAnswerInput.trim() !== "") {
      setWrongAnswers([...wrongAnswers, wrongAnswerInput.trim()]);
      setWrongAnswerInput(""); // Xóa input sau khi thêm
    }
  };
  
  // Xóa câu trả lời sai khỏi danh sách
  const handleRemoveWrongAnswer = (index: number) => {
    setWrongAnswers(wrongAnswers.filter((_, i) => i !== index));
  };
  // Kiểm tra tính hợp lệ: Câu trả lời đúng phải có trong tất cả câu trả lời sai
  const isValid =
    correctAnswers.length > 0 && wrongAnswers.includes(correctAnswers[0]);
    const handleAddSortAnswer = () => {
      if (sortAnswerInput.trim() !== "") {
        setCorrectAnswers([...correctAnswers, sortAnswerInput.trim()]);
        setSortAnswerInput(""); // Xóa input sau khi thêm
      }
    };
    
    // Xóa câu trả lời đúng khỏi danh sách
    const handleRemoveSortAnswer = (index: number) => {
      setCorrectAnswers(correctAnswers.filter((_, i) => i !== index));
    };
  const renderAnswerFields = () => {
    switch (questionType) {
      case "multiple_choice":
        return (
          <>
            {/* Nhập câu trả lời đúng */}
            <div className="mb-4">
              <label
                htmlFor="correctAnswers"
                className="block text-sm font-medium text-blue-700"
              >
                Câu trả lời đúng
              </label>
              <input
                id="correctAnswers"
                type="text"
                value={correctAnswers[0] || ""} // Chỉ có 1 câu trả lời đúng
                onChange={(e) => setCorrectAnswers([e.target.value])}
                className="mt-1 block w-full border-2 border-blue-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Nhập câu trả lời sai */}
            <div className="mb-4">
              <label
                htmlFor="wrongAnswerInput"
                className="block text-sm font-medium text-red-700"
              >
                Thêm câu trả lời
              </label>
              <div className="flex">
                <input
                  id="wrongAnswerInput"
                  type="text"
                  value={wrongAnswerInput} // Biến tạm lưu câu trả lời đang nhập
                  onChange={(e) => setWrongAnswerInput(e.target.value)}
                  className="flex-grow mt-1 block w-full border-2 border-red-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={handleAddWrongAnswer}
                  className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                >
                  Thêm
                </button>
              </div>
            </div>

            {/* Hiển thị danh sách câu trả lời sai */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700">
                Danh sách câu trả lời
              </h3>
              <ul className="mt-2 space-y-2">
                {wrongAnswers.map((answer, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{answer}</span>
                    <button
                      onClick={() => handleRemoveWrongAnswer(index)}
                      className="text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        );
      case "open_answer":
        return (
          <div className="mb-4">
            <label
              htmlFor="correctAnswers"
              className="block text-sm font-medium text-blue-700"
            >
              Câu trả lời đúng (để trống nếu không có nhiều câu trả lời)
            </label>
            <input
              id="correctAnswers"
              type="text"
              value={correctAnswers[0] || ""} // Hiển thị giá trị đầu tiên nếu có, hoặc chuỗi rỗng nếu không
              onChange={(e) => setCorrectAnswers([e.target.value])} // Lưu giá trị nhập vào như một mảng có 1 phần tử
              className="mt-1 block w-full border-2 border-blue-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case "true_false":
        return (
          <div className="mb-4">
            <label
              htmlFor="correctAnswers"
              className="block text-sm font-medium text-blue-700"
            >
              Câu trả lời đúng
            </label>
            <select
              id="correctAnswers"
              value={correctAnswers.length > 0 ? correctAnswers[0] : "Đúng"} // Kiểm tra và dùng "true" nếu không có giá trị
              onChange={(e) => setCorrectAnswers([e.target.value])}
              className="mt-1 block w-full border-2 border-blue-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Đúng">Đúng</option>
              <option value="Sai">Sai</option>
            </select>
          </div>
        );

        case "sort":
          return (
            <>
              {/* Nhập câu trả lời đúng */}
              <div className="mb-4">
                <label
                  htmlFor="sortAnswerInput"
                  className="block text-sm font-medium text-blue-700"
                >
                  Thêm câu trả lời đúng
                </label>
                <div className="flex">
                  <input
                    id="sortAnswerInput"
                    type="text"
                    value={sortAnswerInput} 
                    onChange={(e) => setSortAnswerInput(e.target.value)}
                    className="flex-grow mt-1 block w-full border-2 border-blue-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddSortAnswer}
                    className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                  >
                    Thêm
                  </button>
                </div>
              </div>
        
              {/* Hiển thị danh sách câu trả lời đúng */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700">Danh sách câu trả lời đúng</h3>
                <ul className="mt-2 space-y-2">
                  {correctAnswers.map((answer, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{answer}</span>
                      <button
                        onClick={() => handleRemoveSortAnswer(index)}
                        className="text-red-600 hover:underline"
                      >
                        Xóa
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          );
        
      default:
        return null;
    }
  };

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

        <h2 className="text-xl font-bold mb-6 text-center text-blue-600">
          Thêm câu hỏi mới
        </h2>

        <div className="mb-4">
          <label
            htmlFor="questionText"
            className="block text-sm font-medium text-gray-700"
          >
            Nội dung câu hỏi
          </label>
          <input
            id="questionText"
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="mt-1 block w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="points"
            className="block text-sm font-medium text-gray-700"
          >
            Điểm
          </label>
          <input
            id="points"
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="mt-1 block w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="questionType"
            className="block text-sm font-medium text-gray-700"
          >
            Loại câu hỏi
          </label>
          <select
            id="questionType"
            value={questionType}
            onChange={(e) =>
              setQuestionType(
                e.target.value as
                  | "multiple_choice"
                  | "open_answer"
                  | "true_false"
                  | "sort"
              )
            }
            className="mt-1 block w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="open_answer">Open Answer</option>
            <option value="true_false">True/False</option>
            <option value="sort">Sort</option>
          </select>
        </div>

        {renderAnswerFields()}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onAdd}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Thêm câu hỏi
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionModal;
