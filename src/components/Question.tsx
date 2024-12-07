import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllQuestions, deleteQuestion } from "../redux/quizzSlice";
import { RootState, AppDispatch } from "../redux/store";
import { Question } from "../types/Question";

const Questions: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { questions, loading, error } = useSelector(
    (state: RootState) => state.quizz
  );

  useEffect(() => {
    dispatch(fetchAllQuestions());
  }, [dispatch]);

  const handleDelete = (id_question: string) => {
    dispatch(deleteQuestion(id_question));
    dispatch(fetchAllQuestions());
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Question Management</h2>
      {loading && <p className="text-gray-600 italic">Loading...</p>}
      {error && (
        <p className="text-red-600">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </p>
      )}

      {questions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question: Question) => (
            <div
              key={question.id_Question}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg text-blue-600 mb-2">
                  {question.questionText}
                </h3>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Type:</strong> {question.questionType}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Points:</strong> {question.points}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Hint:</strong> {question.hintText}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Wrong Answers:</strong> {question.wrongAnswers?.join(", ")}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Correct Answers:</strong> {question.correctAnswers?.join(", ")}
                </p>
                <p className="text-sm text-gray-500 italic mb-1">
                  Created At: {new Date(question.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 italic mb-4">
                  Updated At: {new Date(question.updatedAt).toLocaleString()}
                </p>
              </div>

              {/* Button container */}
              <div className="mt-auto">
                <button
                  onClick={() => handleDelete(question.id_Question!)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4">No questions found.</p>
      )}
    </div>
  );
};

export default Questions;
