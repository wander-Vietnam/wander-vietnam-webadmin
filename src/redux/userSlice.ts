// src/redux/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from './store'; 
import { UserGetAll } from "../types/User";

interface UserState {
  users: UserGetAll[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchAllUsers = createAsyncThunk<UserGetAll[], void>(
  'users/fetchAll',
  async () => {
    const response = await apiClient.get('/users/get-all');
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export default userSlice.reducer;
