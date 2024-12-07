import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./store";
import { Question } from "../types/Question";
import { IQuestion } from "../types/Province";

interface QuizzState {
  questions: Question[];
  loading: boolean;
  error: string | null;
}

const initialState: QuizzState = {
  questions: [],
  loading: false,
  error: null,
};

export const fetchQuestionsByTripAndCheckpoint = createAsyncThunk<
  Question[],
  { id_TripQuest: string; id_CheckPoint: string }
>("quizz/fetchByTripAndCheckpoint", async ({ id_TripQuest, id_CheckPoint }) => {
  const response = await apiClient.post("/questions/by-trip-checkpoint", {
    id_TripQuest,
    id_CheckPoint,
  });
  return response.data;
});

export const createQuestion = createAsyncThunk<
  Question,
  IQuestion
>("quizz/createQuestion", async (questionData: IQuestion) => {
  const response = await apiClient.post("/questions/create", questionData);
  return response.data;
});

export const deleteQuestion = createAsyncThunk<
  string,
  string
>("quizz/deleteQuestion", async (id_question: string) => {
  await apiClient.delete(`/questions/delete/${id_question}`);
  return id_question;
});

export const fetchAllQuestions = createAsyncThunk<
  Question[],
  void
>("quizz/fetchAllQuestions", async () => {
  const response = await apiClient.get("/questions/get-all");
  return response.data;
});

const quizzSlice = createSlice({
  name: "quizz",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionsByTripAndCheckpoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsByTripAndCheckpoint.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestionsByTripAndCheckpoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch questions";
      })
      .addCase(createQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions.push(action.payload);
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create question";
      })
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = state.questions.filter(
          (question) => question.id_Question !== action.payload
        );
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete question";
      })
      .addCase(fetchAllQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchAllQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch all questions";
      });
  },
});

export default quizzSlice.reducer;
