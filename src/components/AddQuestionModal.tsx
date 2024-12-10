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

  const onAdd = async () => {
    const newQuestion: IQuestion = {
      id_Question: "generated_id",
      questionText,
      questionType,
      correctAnswers,
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

  const handleCorrectAnswerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCorrectAnswers(event.target.value.split(",").map((item) => item.trim()));
  };

  const handleWrongAnswerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setWrongAnswers(event.target.value.split(",").map((item) => item.trim()));
  };

  const renderAnswerFields = () => {
    switch (questionType) {
      case "multiple_choice":
        return (
          <>
            <div className="mb-4">
              <label
                htmlFor="correctAnswers"
                className="block text-sm font-medium text-blue-700"
              >
                Câu trả lời đúng (ngăn cách bằng dấu phẩy)
              </label>
              <input
                id="correctAnswers"
                type="text"
                value={correctAnswers.join(", ")}
                onChange={handleCorrectAnswerChange}
                className="mt-1 block w-full border-2 border-blue-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="wrongAnswers"
                className="block text-sm font-medium text-red-700"
              >
                Câu trả lời sai (ngăn cách bằng dấu phẩy)
              </label>
              <input
                id="wrongAnswers"
                type="text"
                value={wrongAnswers.join(", ")}
                onChange={handleWrongAnswerChange}
                className="mt-1 block w-full border-2 border-red-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
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
              value={correctAnswers.join(", ")}
              onChange={handleCorrectAnswerChange}
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
              value={correctAnswers[0] || ""}
              onChange={(e) => setCorrectAnswers([e.target.value])}
              className="mt-1 block w-full border-2 border-blue-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        );
      case "sort":
        return (
          <div className="mb-4">
            <label
              htmlFor="correctAnswers"
              className="block text-sm font-medium text-blue-700"
            >
              Câu trả lời đúng (ngăn cách bằng dấu phẩy)
            </label>
            <input
              id="correctAnswers"
              type="text"
              value={correctAnswers.join(", ")}
              onChange={handleCorrectAnswerChange}
              className="mt-1 block w-full border-2 border-blue-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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

        <h2 className="text-xl font-bold mb-6 text-center text-blue-600">Thêm câu hỏi mới</h2>

        <div className="mb-4">
          <label htmlFor="questionText" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="points" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="questionType" className="block text-sm font-medium text-gray-700">
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
