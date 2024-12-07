import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./store"; // Assuming apiClient is already configured
import { Review } from "../types/Review";

// Initial state for the reviews slice
interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

// Thunk to fetch all reviews
export const fetchAllReviews = createAsyncThunk<Review[]>(
  "reviews/fetchAll",
  async () => {
    const response = await apiClient.get("/review/get-all");
    return response.data;
  }
);

// Thunk to delete a review
export const deleteReview = createAsyncThunk<void, string>(
  "reviews/delete",
  async (id_Review) => {
    await apiClient.delete(`/review/delete/${id_Review}`);
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch reviews";
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (review) => review.id_Review !== action.meta.arg
        );
      });
  },
});

export default reviewSlice.reducer;
