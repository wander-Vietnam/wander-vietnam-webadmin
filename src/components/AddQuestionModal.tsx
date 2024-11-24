import React, { useState } from 'react';

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkpointId: string;
  tripQuestId: string;
}

interface IQuestion {
  id_Question: string;
  questionText: string;
  questionType: 'multiple_choice' | 'open_answer' | 'true_false' | 'sort';
  correctAnswers: string[];
  wrongAnswers: string[];
  points: number;
  id_CheckPoint: string;
  id_TripQuest: string;
}

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  onClose,
  checkpointId,
  tripQuestId,
}) => {
  const [questionText, setQuestionText] = useState('');
  const [points, setPoints] = useState(0);
  const [questionType, setQuestionType] = useState<'multiple_choice' | 'open_answer' | 'true_false' | 'sort'>('multiple_choice');
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);

  const onAdd = async () => {
    // Build the question object
    const newQuestion: IQuestion = {
      id_Question: 'generated_id', // You might want to generate this dynamically or handle it server-side
      questionText,
      questionType,
      correctAnswers,
      wrongAnswers,
      points,
      id_CheckPoint: checkpointId,
      id_TripQuest: tripQuestId,
    };

    // Call your API function to add the question
    // Assuming addQuestion is available globally or imported here
    try {
    //   await addQuestion(newQuestion);
      console.log('Question added successfully', newQuestion);
      onClose();
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };


  const handleCorrectAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCorrectAnswers(event.target.value.split(',').map((item) => item.trim()));
  };

  const handleWrongAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWrongAnswers(event.target.value.split(',').map((item) => item.trim()));
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

        <h2 className="text-xl font-bold mb-4">Thêm câu hỏi mới:</h2>
        <div className="mb-4">
          <label htmlFor="questionText" className="block text-sm font-medium">
            Nội dung câu hỏi
          </label>
          <input
            id="questionText"
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="points" className="block text-sm font-medium">
            Điểm
          </label>
          <input
            id="points"
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="questionType" className="block text-sm font-medium">
            Loại câu hỏi
          </label>
          <select
            id="questionType"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value as 'multiple_choice' | 'open_answer' | 'true_false' | 'sort')}
            className="mt-1 block w-full border border-gray-300 rounded-md"
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="open_answer">Open Answer</option>
            <option value="true_false">True/False</option>
            <option value="sort">Sort</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="correctAnswers" className="block text-sm font-medium">
            Câu trả lời đúng (ngăn cách bằng dấu phẩy)
          </label>
          <input
            id="correctAnswers"
            type="text"
            value={correctAnswers.join(', ')}
            onChange={handleCorrectAnswerChange}
            className="mt-1 block w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="wrongAnswers" className="block text-sm font-medium">
            Câu trả lời sai (ngăn cách bằng dấu phẩy)
          </label>
          <input
            id="wrongAnswers"
            type="text"
            value={wrongAnswers.join(', ')}
            onChange={handleWrongAnswerChange}
            className="mt-1 block w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Thêm câu hỏi
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionModal;
