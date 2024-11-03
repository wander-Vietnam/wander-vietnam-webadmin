import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tripquestReducer from './tripquestSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tripquest: tripquestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
