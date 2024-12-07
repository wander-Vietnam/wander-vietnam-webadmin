import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from './store'; // Đảm bảo apiClient đã được định nghĩa và import đúng
import { TripTypesState } from '../types/TripType';

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
      const response = await apiClient.get('/triptype/get-all'); // Sử dụng apiClient
      return response.data; // Trả về dữ liệu trip types
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error.response?.data || 'Failed to fetch trip types');
    }
  }
);
export const deleteTripType = createAsyncThunk(
  'tripTypes/delete',
  async (id_tripType: string, { rejectWithValue }) => {
    try {
      // Call the API to delete the trip type
      await apiClient.delete(`/triptype/delete/${id_tripType}`); // Use the API endpoint for deletion
      return id_tripType; // Return the id of the deleted trip type to remove it from the state
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error.response?.data || 'Failed to delete trip type');
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
        state.tripTypes = action.payload;
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
        state.tripTypes.push(action.payload); // Add new trip type to the list
      })
      .addCase(createTripType.rejected, (state, action) => {
        state.creating = false;
        state.errorTriptype = action.payload as string || 'Failed to create trip type';
      })
      .addCase(deleteTripType.pending, (state) => {
        state.loadingTriptype = true;
        state.errorTriptype = null;
      })
      .addCase(deleteTripType.fulfilled, (state, action) => {
        state.loadingTriptype = false;
        // Remove the deleted trip type from the list of trip types
        state.tripTypes = state.tripTypes.filter(
          (tripType) => tripType.id_TripType !== action.payload
        );
      })
      .addCase(deleteTripType.rejected, (state, action) => {
        state.loadingTriptype = false;
        state.errorTriptype = action.payload as string || 'Failed to delete trip type';
      });
  },
});

export default tripTypesSlice.reducer;
