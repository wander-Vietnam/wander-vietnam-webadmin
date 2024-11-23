import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from './store'; // Đảm bảo `apiClient` đã được cấu hình
import { Checkpoint, AllCheckpointsResponse, ICheckPointCreate } from '../types/Checkpoint';

interface CheckpointState {
  checkpoints: Checkpoint[]; // Dữ liệu của API khác
  allCheckpoints: AllCheckpointsResponse[]; // Dữ liệu cho API getAllCheckpoints
  availableCheckpoints: AllCheckpointsResponse[]; // Dữ liệu cho API getAvailableCheckpoints
  loading: boolean;
  error: string | null;
}

const initialState: CheckpointState = {
  checkpoints: [],
  allCheckpoints: [], // State riêng cho dữ liệu getAll
  availableCheckpoints: [], // Thêm state cho dữ liệu available checkpoints
  loading: false,
  error: null,
};
export const addCheckPoint = createAsyncThunk<
  string, 
  { checkpointData: ICheckPointCreate },
  { rejectValue: string }
>(
  'checkpoints/addCheckPoint',
  async ({ checkpointData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/checkpoints/add', checkpointData);
      return response.data.id; // Trả về ID của checkpoint mới được tạo
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to add checkpoint');
    }
  }
);
// Thunk để lấy tất cả checkpoints
export const fetchAllCheckpoints = createAsyncThunk<
  AllCheckpointsResponse[],
  void,
  { rejectValue: string }
>(
  'checkpoints/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/checkpoints/get-all-checkpoints');
      return response.data; // Trả về dữ liệu từ API
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch all checkpoints');
    }
  }
);

// Thunk để lấy checkpoints theo idTripQuest
export const fetchCheckpointsByTripquest = createAsyncThunk<
  Checkpoint[],
  string,
  { rejectValue: string }
>(
  'checkpoints/fetchByTripquest',
  async (idTripQuest, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/checkpoints/get-checkpoints-by-tripquest/${idTripQuest}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch checkpoints');
    }
  }
);

// Thunk để lấy các checkpoint chưa có trong TripQuest
export const fetchAvailableCheckpoints = createAsyncThunk<
  AllCheckpointsResponse[],
  string,
  { rejectValue: string }
>(
  'checkpoints/fetchAvailable',
  async (idTripQuest, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/checkpoints/get-available-checkpoints/${idTripQuest}`);
      return response.data; // Trả về dữ liệu từ API
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch available checkpoints');
    }
  }
);

const checkpointSlice = createSlice({
  name: 'checkpoints',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Xử lý fetchAllCheckpoints
      .addCase(fetchAllCheckpoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCheckpoints.fulfilled, (state, action) => {
        state.loading = false;
        state.allCheckpoints = action.payload;
      })
      .addCase(fetchAllCheckpoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch all checkpoints';
      })

      // Xử lý fetchCheckpointsByTripquest
      .addCase(fetchCheckpointsByTripquest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCheckpointsByTripquest.fulfilled, (state, action) => {
        state.loading = false;
        state.checkpoints = action.payload;
      })
      .addCase(fetchCheckpointsByTripquest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch checkpoints';
      })

      // Xử lý fetchAvailableCheckpoints (API mới)
      .addCase(fetchAvailableCheckpoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableCheckpoints.fulfilled, (state, action) => {
        state.loading = false;
        state.availableCheckpoints = action.payload; 
      })
      .addCase(fetchAvailableCheckpoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch available checkpoints';
      })
      .addCase(addCheckPoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCheckPoint.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addCheckPoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add checkpoint';
      });
  }
});

export default checkpointSlice.reducer;
