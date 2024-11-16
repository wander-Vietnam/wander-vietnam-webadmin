import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
interface TripType {
  id: string;
  name: string;
}

interface TripTypesState {
  tripTypes: TripType[];
  loading: boolean;
  error: string | null;
  creating: boolean;
}

// Định nghĩa state ban đầu
const initialState: TripTypesState = {
  tripTypes: [],
  loading: false,
  error: null,
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
    async (tripTypeData: TripType, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/triptype/create`); 
        return response.data; // Trả về dữ liệu trip type vừa tạo
      } catch (error: any) {
        console.error(error);
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTripTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.tripTypes = action.payload; // Cập nhật danh sách tripTypes
      })
      .addCase(fetchAllTripTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch trip types';
      })
      .addCase(createTripType.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createTripType.fulfilled, (state, action) => {
        state.creating = false;
        state.tripTypes.push(action.payload); // Thêm tripType mới vào danh sách
      })
      .addCase(createTripType.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string || 'Failed to create trip type';
      });
  },
});

export default tripTypesSlice.reducer;
