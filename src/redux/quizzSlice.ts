import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from './store'; // Assuming apiClient is already configured
import { Question } from "../types/Checkpoint";

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

// Thunk to fetch questions based on trip and checkpoint
export const fetchQuestionsByTripAndCheckpoint = createAsyncThunk<
  Question[], // Return type of the thunk
  { id_TripQuest: string; id_CheckPoint: string } // Payload type
>(
  'quizz/fetchByTripAndCheckpoint',
  async ({ id_TripQuest, id_CheckPoint }) => {
    const response = await apiClient.post('/questions/by-trip-checkpoint', {
      id_TripQuest,
      id_CheckPoint
    });
    return response.data; 
  }
);

const quizzSlice = createSlice({
  name: 'quizz',
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
        state.error = action.error.message || 'Failed to fetch questions';
      });
  },
});

export default quizzSlice.reducer;
