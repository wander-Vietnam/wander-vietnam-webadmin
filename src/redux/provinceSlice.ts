import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from './store';
import { Province,NewProvince } from '../types/Province';

interface ProvinceState {
  provinces: Province[];
  loading: boolean;
  error: string | null;
}

const initialState: ProvinceState = {
  provinces: [],
  loading: false,
  error: null,
};

// Thunk để lấy tất cả tỉnh
export const fetchAllProvinces = createAsyncThunk<Province[], void>(
  'provinces/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/province/get-all');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch provinces');
    }
  }
);

// Thunk để tạo tỉnh
export const createProvince = createAsyncThunk<Province, NewProvince>(
  'provinces/create',
  async (provinceData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/province/create', provinceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create province');
    }
  }
);

// Thunk để cập nhật tỉnh
export const updateProvince = createAsyncThunk<Province, { id: string, data: Province }>(
  'provinces/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/province/update/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update province');
    }
  }
);

// Thunk để xóa tỉnh
export const deleteProvince = createAsyncThunk<void, string>(
  'provinces/delete',
  async (provinceId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/province/delete/${provinceId}`);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete province');
    }
  }
);

const provinceSlice = createSlice({
  name: 'provinces',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all provinces
      .addCase(fetchAllProvinces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProvinces.fulfilled, (state, action) => {
        state.loading = false;
        state.provinces = action.payload;
      })
      .addCase(fetchAllProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch provinces';
      })
      
      // Create province
      .addCase(createProvince.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProvince.fulfilled, (state, action) => {
        state.loading = false;
        state.provinces.push(action.payload); // Thêm tỉnh mới vào danh sách
      })
      .addCase(createProvince.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create province';
      })

      // Update province
      .addCase(updateProvince.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProvince.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.provinces.findIndex(province => province.id_city === action.payload.id_city);
        if (index !== -1) {
          state.provinces[index] = action.payload; // Cập nhật tỉnh
        }
      })
      .addCase(updateProvince.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update province';
      })

      // Delete province
      .addCase(deleteProvince.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProvince.fulfilled, (state, action) => {
        state.loading = false;
        state.provinces = state.provinces.filter(province => province.id_city !== action.meta.arg); // Xóa tỉnh
      })
      .addCase(deleteProvince.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to delete province';
      })
  },
});

export default provinceSlice.reducer;
