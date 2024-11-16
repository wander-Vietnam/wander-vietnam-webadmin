// imageSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ImageState {
  imageLinks: string[];
  loading: boolean;
  error: string | null;
}

const initialState: ImageState = {
  imageLinks: [],
  loading: false,
  error: null,
};
export const uploadImage = createAsyncThunk<string[], FormData>(
    'images/upload',
    async (formData, { rejectWithValue }) => {
      try {
        console.log(formData);
        const response = await axios.post<string[]>('https://tranngoctu.click/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error: any) {
        // Handle errors and return them
        console.error(error);
        return rejectWithValue(error.response?.data || 'Failed to upload image');
      }
    }
  );

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.imageLinks = action.payload; // Lưu link ảnh vào trạng thái
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to upload image';
      });
  },
});

export default imageSlice.reducer;
