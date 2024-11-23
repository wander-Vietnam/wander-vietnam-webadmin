import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from './store';
import { City } from '../types/City';

interface CityState {
  cities: City[]; // Dữ liệu thành phố
  loading: boolean;
  error: string | null;
}

const initialState: CityState = {
  cities: [], // State chứa tất cả các thành phố
  loading: false,
  error: null,
};

// Thunk để lấy tất cả thành phố
export const fetchAllCities = createAsyncThunk<City[], void, { rejectValue: string }>(
  'cities/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/province/get-all');
      return response.data; // Trả về dữ liệu từ API
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch all cities');
    }
  }
);

const citySlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Xử lý khi fetchAllCities đang thực hiện
      .addCase(fetchAllCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Xử lý khi fetchAllCities thành công
      .addCase(fetchAllCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload; // Lưu dữ liệu thành phố vào state
      })
      // Xử lý khi fetchAllCities thất bại
      .addCase(fetchAllCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch all cities';
      });
  }
});

export default citySlice.reducer;
