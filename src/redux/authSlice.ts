// src/redux/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../types/User";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null; // Thay đổi kiểu cho user
  loading: boolean;
  error: string | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  accessToken: null,
};

interface LoginResponse {
  user: User;
  accessToken: string;
}

export const login = createAsyncThunk<LoginResponse, { phoneOrEmail: string; password: string }>(
  "auth/login-admin",
  async (credentials) => {
    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    if (!apiUrl) {
      throw new Error("API Base URL is not defined");
    }
    const response = await axios.post(`${apiUrl}/auth/login-admin`, credentials);
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  }
);

// Tạo một axios instance


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("accessToken");
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    loginSuccess: (state) => {
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      });
  },
});


export const { logout, setAccessToken, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
