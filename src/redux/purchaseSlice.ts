import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./store"; // Assuming apiClient is already configured
import { PurchaseHistory } from "../types/Purchase"; // Adjust the import path as needed

// Initial state for the purchase slice
interface PurchaseState {
  purchases: PurchaseHistory[];
  loading: boolean;
  error: string | null;
}

const initialState: PurchaseState = {
  purchases: [],
  loading: false,
  error: null,
};

// Thunk to fetch all purchase histories
export const fetchAllPurchases = createAsyncThunk<PurchaseHistory[]>(
  "purchases/fetchAll",
  async () => {
    const response = await apiClient.get("/purchase-history/get-all");
    return response.data;
  }
);

const purchaseSlice = createSlice({
  name: "purchases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload;
      })
      .addCase(fetchAllPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch purchase histories";
      });
  },
});

export default purchaseSlice.reducer;
