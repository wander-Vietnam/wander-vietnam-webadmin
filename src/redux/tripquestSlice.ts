import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface TripquestState {
  cards: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TripquestState = {
  cards: [],
  loading: false,
  error: null,
};

export const fetchTripquestCards = createAsyncThunk('tripquest/fetchCards', async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tripquest/get-all-card`);
    return response.data;
  });
  

const tripquestSlice = createSlice({
  name: 'tripquest',
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
        state.cards = action.payload; // Cập nhật danh sách thẻ
      })
      .addCase(fetchTripquestCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tripquest cards';
      });
  },
});

export default tripquestSlice.reducer;
