export interface Question {
    id_Question: string;
    questionText: string;
    questionType: 'open_answer' | 'true_false' | 'multiple_choice' | 'sort'; // Adjust according to the types you expect
    points: number;
    id_CheckPoint: string;
    id_TripQuest: string;
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
    correctAnswers: string[]; // Array of correct answers
    wrongAnswers: string[] | null; // Array of wrong answers or null if not applicable
    hintText: string | null; // Optional hint text
    checkpointName: string;
    tripQuestName: string;
    answers?: {
      correctAnswers: string[];
      wrongAnswers: string[];
    }; // Optional field, may be the same as correctAnswers and wrongAnswers
  }
  