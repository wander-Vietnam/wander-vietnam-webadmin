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

// Thunk để lấy tất cả người dùng
export const fetchAllUsers = createAsyncThunk<UserGetAll[], void>(
  'users/fetchAll',
  async () => {
    const response = await apiClient.get('/users/get-all');
    return response.data;
  }
);

// Thunk để xóa người dùng
export const deleteUser = createAsyncThunk<void, string>(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/users/delete-admin/${userId}`);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete user');
    }
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
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.meta.arg);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to delete user';
      });
  },
});

export default userSlice.reducer;
