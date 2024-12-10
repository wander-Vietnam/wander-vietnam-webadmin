import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./store"; // Assuming apiClient is already configured

// Define the payload type for createTextToSpeech
interface CreateTextToSpeechPayload {
  id_TripQuest: string;
  id_CheckPoint: string;
  storyQuest: string;
}

// Initial state for the text-to-speech slice
interface TextToSpeechState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: TextToSpeechState = {
  loading: false,
  error: null,
  success: false,
};

// Thunk to create text-to-speech
export const createTextToSpeech = createAsyncThunk<
  { message: string; statusCode: number },
  CreateTextToSpeechPayload
>("textToSpeech/createTextToSpeech", async ({ id_TripQuest, id_CheckPoint, storyQuest }) => {
  const response = await apiClient.post("/checkpoints/create-text-to-speech", {
    id_TripQuest,
    id_CheckPoint,
    storyQuest,
  });
  return response.data;
});

const textToSpeechSlice = createSlice({
  name: "textToSpeech",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTextToSpeech.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTextToSpeech.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = action.payload.message;
      })
      .addCase(createTextToSpeech.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create text-to-speech";
        state.success = false;
      });
  },
});

export default textToSpeechSlice.reducer;
