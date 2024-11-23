export interface Question {
  id_Question: string | null;
  questionText: string | null;
  questionType: "open_answer" | "true_false" | "multiple_choice" | "sort";
  points: number | null;
  hintText: string | null;
  wrongAnswers: string[] | null;
  correctAnswers: string[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Checkpoint {
  id_CheckPoint: string;
  checkpointName: string;
  latitude: string;
  longitude: string;
  operatingHours: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}
export interface AllCheckpointsResponse {
    id_CheckPoint: string;
    longitude: string;
    latitude: string;
    id_City: string;
    checkpointName: string;
    operatingHours: string;
    createdAt: string;
    updatedAt: string;
    address: string;
  }
  export interface ICheckPointCreate {
    latitude: string;        
    longitude: string;        
    id_City: string;          
    checkpointName: string;  
    operatingHours?: string;
    address: string;   
  }
  
