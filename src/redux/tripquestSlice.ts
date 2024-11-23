import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiClient } from './store';

interface TripquestState {
  cards: any[];
  loading: boolean;
  error: string | null;
  createLoading: boolean;  // For tracking creation loading state
  createError: string | null;  // For tracking creation error state
}

const initialState: TripquestState = {
  cards: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
};

// Fetch trip quest cards
export const fetchTripquestCards = createAsyncThunk('tripquest/fetchCards', async () => {
  const response = await apiClient.get('tripquest/get-all');
  console.log("response",response)
  return response.data;
});

// Create a new trip quest
export const createTripquest = createAsyncThunk(
  'tripquest/createTripquest',
  async (tripQuestData: {
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
  }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('tripquest/create-trip-quest', tripQuestData);
      return response.data;  // Data should include tripQuestId or any other success details
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const tripquestSlice = createSlice({
  name: 'tripquest',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetching trip quests
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
        state.error = action.error.message || 'Failed to fetch tripquest cards';
      });

    // Handle creating a new trip quest
    builder
      .addCase(createTripquest.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createTripquest.fulfilled, (state, action) => {
        state.createLoading = false;
        // Optionally, you can add the new trip quest to the existing list
        state.cards.push(action.payload);
      })
      .addCase(createTripquest.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = typeof action.payload === 'string' 
        ? action.payload 
        : 'Failed to create trip quest';
    });
  },
});

export default tripquestSlice.reducer;
