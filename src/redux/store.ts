import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tripquestReducer from './tripquestSlice';
import userReducer from './userSlice';
import provinceReducer from './provinceSlice';
import axios from 'axios';
const store = configureStore({
  reducer: {
    auth: authReducer,
    tripquest: tripquestReducer,
    users: userReducer,
    provinces: provinceReducer
  },
});
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
  });
  
  apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { apiClient };
export default store;
