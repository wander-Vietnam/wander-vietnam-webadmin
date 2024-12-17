import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./store"; // Đảm bảo `apiClient` đã được cấu hình
import {
  Checkpoint,
  AllCheckpointsResponse,
  CheckpointsDetailResponse,
  ICheckPointCreate,
  ICheckPointUpdate,
  AllCheckpoint,
} from "../types/Checkpoint";

interface CheckpointState {
  checkpoints: Checkpoint[];
  allCheckpoints: AllCheckpointsResponse[]; // Dữ liệu cho API getAllCheckpoints
  availableCheckpoints: AllCheckpointsResponse[]; // Dữ liệu cho API getAvailableCheckpoints
  loading: boolean;
  error: string | null;
  fetchById: boolean;
  checkpointDetail: CheckpointsDetailResponse | null;
  allCheckpoint: AllCheckpoint[];
  storyQuestData: any;
}

const initialState: CheckpointState = {
  checkpoints: [],
  allCheckpoints: [], // State riêng cho dữ liệu getAll
  availableCheckpoints: [], // Thêm state cho dữ liệu available checkpoints
  loading: false,
  fetchById: false,
  error: null,
  checkpointDetail: null,
  allCheckpoint: [],
  storyQuestData: null,
};
export const addCheckPoint = createAsyncThunk<
  string,
  { checkpointData: ICheckPointCreate },
  { rejectValue: string }
>(
  "checkpoints/addCheckPoint",
  async ({ checkpointData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/checkpoints/add", checkpointData);
      return response.data.id; // Trả về ID của checkpoint mới được tạo
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to add checkpoint"
      );
    }
  }
);
export const updateCheckpoint = createAsyncThunk<
  Checkpoint,
  { id: string; checkpointData: ICheckPointUpdate },
  { rejectValue: string }
>(
  "checkpoints/updateCheckpoint",
  async ({ id, checkpointData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/checkpoints/update/${id}`,
        checkpointData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to update checkpoint"
      );
    }
  }
);
export const getStoryQuestByIds = createAsyncThunk<
  any,
  { id_TripQuest: string; id_CheckPoint: string },
  { rejectValue: string }
>(
  "checkpoints/getStoryQuestByIds",
  async ({ id_TripQuest, id_CheckPoint }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/checkpoints/get-story-quest", {
        id_TripQuest,
        id_CheckPoint,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch story quest by IDs"
      );
    }
  }
);

export const deleteTripQuestLocation = createAsyncThunk<
  void,
  { id_CheckPoint: string; id_TripQuest: string },
  { rejectValue: string }
>(
  "checkpoints/deleteTripQuestLocation",
  async ({ id_CheckPoint, id_TripQuest }, { rejectWithValue }) => {
    try {
      await apiClient.post("/tripquest/delete-tripquest-location", {
        id_CheckPoint,
        id_TripQuest,
      });
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to delete tripquest location"
      );
    }
  }
);
export const fetchCheckpointById = createAsyncThunk<
  CheckpointsDetailResponse,
  string,
  { rejectValue: string }
>("checkpoints/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(`/checkpoints/get-by-id/${id}`);
    return response.data; // Trả về dữ liệu checkpoint
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch checkpoint by ID"
    );
  }
});
export const fetchAllCheckpoint = createAsyncThunk<
  AllCheckpoint[], // Return type
  void, // Argument type
  { rejectValue: string }
>("checkpoints/fetchAllCheckpoints", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get("/checkpoints/get-all-checkpoint");
    return response.data; // Return the fetched data
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "Failed to fetch all checkpoints"
    );
  }
});
export const deleteCheckpoint = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("checkpoints/deleteCheckpoint", async (id, { rejectWithValue }) => {
  try {
    // Gọi API DELETE
    await apiClient.delete(`/checkpoints/delete/${id}`);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "Failed to delete checkpoint"
    );
  }
});

// Thunk để lấy tất cả checkpoints
export const fetchAllCheckpoints = createAsyncThunk<
  AllCheckpointsResponse[],
  void,
  { rejectValue: string }
>("checkpoints/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get("/checkpoints/get-all-checkpoints");
    return response.data; // Trả về dữ liệu từ API
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "Failed to fetch all checkpoints"
    );
  }
});
export const fetchCheckpointsByTripquest = createAsyncThunk<
  Checkpoint[],
  string,
  { rejectValue: string }
>("checkpoints/fetchByTripquest", async (idTripQuest, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(
      `/checkpoints/get-checkpoints-by-tripquest/${idTripQuest}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "Failed to fetch checkpoints"
    );
  }
});
export const addTripQuestLocation = createAsyncThunk<
  void,
  { id_CheckPoint: string; id_TripQuest: string },
  { rejectValue: string }
>(
  "checkpoints/addTripQuestLocation",
  async ({ id_CheckPoint, id_TripQuest }, { rejectWithValue }) => {
    try {
      await apiClient.post("/tripquest/create-tripquest-location", {
        id_CheckPoint,
        id_TripQuest,
      });
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to add tripquest location"
      );
    }
  }
);

export const fetchAvailableCheckpoints = createAsyncThunk<
  AllCheckpointsResponse[],
  string,
  { rejectValue: string }
>("checkpoints/fetchAvailable", async (idTripQuest, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(
      `/checkpoints/get-available-checkpoints/${idTripQuest}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "Failed to fetch available checkpoints"
    );
  }
});

const checkpointSlice = createSlice({
  name: "checkpoints",
  initialState,
  reducers: {
    cleanStoryQuestData: (state) => {
      state.storyQuestData = null;
    },
  },
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
        state.error = action.payload || "Failed to fetch all checkpoints";
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
        state.error = action.payload || "Failed to fetch checkpoints";
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
        state.error = action.payload || "Failed to fetch available checkpoints";
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
        state.error = action.payload || "Failed to add checkpoint";
      })
      .addCase(fetchCheckpointById.pending, (state) => {
        state.fetchById = true;
        state.error = null;
      })
      .addCase(fetchCheckpointById.fulfilled, (state, action) => {
        state.fetchById = false;
        state.checkpointDetail = action.payload;
      })
      .addCase(fetchCheckpointById.rejected, (state, action) => {
        state.fetchById = false;
        state.error = action.payload || "Failed to fetch checkpoint by ID";
      })
      .addCase(updateCheckpoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCheckpoint.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCheckpoint = action.payload;
      })
      .addCase(updateCheckpoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update checkpoint";
      })
      .addCase(addTripQuestLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTripQuestLocation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addTripQuestLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add tripquest location";
      })
      .addCase(deleteTripQuestLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTripQuestLocation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteTripQuestLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete tripquest location";
      })
      .addCase(fetchAllCheckpoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCheckpoint.fulfilled, (state, action) => {
        state.loading = false;
        state.allCheckpoint = action.payload; // Store the fetched data
      })
      .addCase(fetchAllCheckpoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch all checkpoints";
      })
      .addCase(deleteCheckpoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCheckpoint.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteCheckpoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete checkpoint";
      })
      .addCase(getStoryQuestByIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoryQuestByIds.fulfilled, (state, action) => {
        state.loading = false;
        // Save the fetched story quest data into the state
        state.storyQuestData = action.payload; // Assuming `storyQuestData` is part of your state
      })
      .addCase(getStoryQuestByIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch story quest by IDs";
      });
  },
});
export const { cleanStoryQuestData } = checkpointSlice.actions;
export default checkpointSlice.reducer;
