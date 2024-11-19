import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiClient } from './store';
interface TripType {
  id: string;
  name: string;
}

interface TripTypesState {
  tripTypes: TripType[];
  loadingTriptype: boolean;
  errorTriptype: string | null;
  creating: boolean;
}

// Định nghĩa state ban đầu
const initialState: TripTypesState = {
  tripTypes: [],
  loadingTriptype: false,
  errorTriptype: null,
  creating: false,
};

// Tạo async thunk để gọi API và lấy tất cả tripTypes
export const fetchAllTripTypes = createAsyncThunk(
  'tripTypes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/triptype/get-all`); 
      return response.data; // Trả về dữ liệu trip types
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error.response?.data || 'Failed to fetch trip types');
    }
  }
);

export const createTripType = createAsyncThunk(
  'tripTypes/create',
  async (tripTypeName: string, { rejectWithValue }) => {
    try {
      // Sử dụng apiClient để gọi API
      const response = await apiClient.post(
        '/triptype/create', // Đường dẫn API
        { tripTypeName }    // Gửi tripTypeName trong payload
      );
      return response.data; // Trả về dữ liệu khi tạo thành công
    } catch (error: any) {
      console.error(error);
      // Trả về lỗi nếu có
      return rejectWithValue(error.response?.data || 'Failed to create trip type');
    }
  }
);
  

// Tạo slice cho tripTypes
const tripTypesSlice = createSlice({
  name: 'tripTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTripTypes.pending, (state) => {
        state.loadingTriptype = true;
        state.errorTriptype = null;
      })
      .addCase(fetchAllTripTypes.fulfilled, (state, action) => {
        state.loadingTriptype = false;
        state.tripTypes = action.payload; // Cập nhật danh sách tripTypes
      })
      .addCase(fetchAllTripTypes.rejected, (state, action) => {
        state.loadingTriptype = false;
        state.errorTriptype = action.payload as string || 'Failed to fetch trip types';
      })
      .addCase(createTripType.pending, (state) => {
        state.creating = true;
        state.errorTriptype = null;
      })
      .addCase(createTripType.fulfilled, (state, action) => {
        state.creating = false;
        state.tripTypes.push(action.payload); // Thêm tripType mới vào danh sách
      })
      .addCase(createTripType.rejected, (state, action) => {
        state.creating = false;
        state.errorTriptype = action.payload as string || 'Failed to create trip type';
      });
  },
});

export default tripTypesSlice.reducer;
