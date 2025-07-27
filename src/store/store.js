import { configureStore } from '@reduxjs/toolkit';
import drugReducer from './drugSlice';
import learningReducer from './learningSlice';
import authReducer from './authSlice';
import studyRecordsReducer from './studyRecordsSlice';

export const store = configureStore({
  reducer: {
    drugs: drugReducer,
    learning: learningReducer,
    auth: authReducer,
    studyRecords: studyRecordsReducer,
  },
});

export default store; 