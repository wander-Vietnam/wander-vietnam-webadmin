import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiClient } from "./store";

interface TripquestState {
  cards: any[];
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
}

const initialState: TripquestState = {
  cards: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
};

export const fetchTripquestCards = createAsyncThunk(
  "tripquest/fetchCards",
  async () => {
    const response = await apiClient.get("tripquest/get-all");
    console.log("response", response);
    return response.data;
  }
);

export const createTripquest = createAsyncThunk(
  "tripquest/createTripquest",
  async (
    tripQuestData: {
      tripQuestName: string;
      description: string;
      imageUrl: string[];
      price: number;
      isForTeamBuilding: boolean;
      id_TripType: string;
      expectedDuration: string;
      startTime: string;
      endTime: string;
      importantDetails: string[];
      highlights: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("tripQuestData", tripQuestData);
      const response = await apiClient.post(
        "tripquest/create-trip-quest",
        tripQuestData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTripquestStatus = createAsyncThunk(
  "tripquest/updateStatus",
  async (
    updateData: { id_TripQuest: string; isActive: boolean },
    { rejectWithValue }
  ) => {
    console.log("updateTripQuestStatus", updateData)
    try {
      const response = await apiClient.post(
        "tripquest/update-tripquest-status",
        updateData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const tripquestSlice = createSlice({
  name: "tripquest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTripquestCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTripquestCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(fetchTripquestCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tripquest cards";
      });
    builder
      .addCase(createTripquest.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createTripquest.fulfilled, (state, action) => {
        state.createLoading = false;
        state.cards.push(action.payload);
      })
      .addCase(createTripquest.rejected, (state, action) => {
        state.createLoading = false;
        state.createError =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to create trip quest";
      })
      .addCase(updateTripquestStatus.pending, (state) => {})
      .addCase(updateTripquestStatus.fulfilled, (state, action) => {
        const index = state.cards.findIndex(
          (card) => card.id_TripQuest === action.payload.id_TripQuest
        );
        if (index !== -1) {
          state.cards[index].isActive = action.payload.isActive;
        }
      })
      .addCase(updateTripquestStatus.rejected, (state, action) => {
        console.error(
          "Failed to update tripquest status:",
          action.error.message
        );
      });
  },
});

export default tripquestSlice.reducer;
