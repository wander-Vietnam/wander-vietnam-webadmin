export interface Province {
    id_city: string;
    cityName: string;
    isFeatured: boolean;
}
export interface NewProvince {
    cityName: string;
    isFeatured: boolean;
  }
  export interface IQuestion {
    id_Question: string;
    questionText: string;
    questionType: 'multiple_choice' | 'open_answer' | 'true_false' | 'sort';
    correctAnswers: string[];
    wrongAnswers: string[];
    points: number;
    id_CheckPoint: string;
    id_TripQuest: string;
  }