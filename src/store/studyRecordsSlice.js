import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studyRecordsAPI } from '../services/api';

// Async thunks for study records
export const updateStudyRecord = createAsyncThunk(
  'studyRecords/updateStudyRecord',
  async (recordData, { rejectWithValue }) => {
    try {
      const response = await studyRecordsAPI.updateStudyRecord(recordData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update study record');
    }
  }
);

export const fetchAllStudyRecords = createAsyncThunk(
  'studyRecords/fetchAllStudyRecords',
  async (_, { rejectWithValue }) => {
    try {
      const response = await studyRecordsAPI.getAllStudyRecords();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch study records');
    }
  }
);

export const fetchUserStudyRecord = createAsyncThunk(
  'studyRecords/fetchUserStudyRecord',
  async (userId, { rejectWithValue }) => {
    if (!userId) {
      return rejectWithValue('User ID is required');
    }
    try {
      const response = await studyRecordsAPI.getUserStudyRecord(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user study record');
    }
  }
);

const initialState = {
  userRecord: null,
  allRecords: [],
  leaderboard: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const studyRecordsSlice = createSlice({
  name: 'studyRecords',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearStudyRecords: (state) => {
      state.userRecord = null;
      state.allRecords = [];
      state.leaderboard = [];
    },
    updateLocalRecord: (state, action) => {
      // Update local record without API call for immediate UI updates
      state.userRecord = { ...state.userRecord, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Study Record
      .addCase(updateStudyRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStudyRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userRecord = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(updateStudyRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch All Study Records
      .addCase(fetchAllStudyRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllStudyRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allRecords = action.payload;
        // Create leaderboard sorted by total score, then by finished learning, then by current learning
        state.leaderboard = [...action.payload].sort((a, b) => {
          // Primary sort: total score (highest first)
          if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore;
          }
          // Tie-breaker 1: finished learning count (highest first)
          if (b.finishedLearning !== a.finishedLearning) {
            return b.finishedLearning - a.finishedLearning;
          }
          // Tie-breaker 2: current learning count (highest first)
          if (b.currentLearning !== a.currentLearning) {
            return b.currentLearning - a.currentLearning;
          }
          // Final tie-breaker: username alphabetically (consistent ordering)
          return a.user.username.localeCompare(b.user.username);
        });
        state.error = null;
      })
      .addCase(fetchAllStudyRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch User Study Record
      .addCase(fetchUserStudyRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserStudyRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userRecord = action.payload;
        state.error = null;
      })
      .addCase(fetchUserStudyRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearStudyRecords, updateLocalRecord } = studyRecordsSlice.actions;

// Selectors
export const selectUserRecord = (state) => state.studyRecords.userRecord;
export const selectAllRecords = (state) => state.studyRecords.allRecords;
export const selectLeaderboard = (state) => state.studyRecords.leaderboard;
export const selectStudyRecordsLoading = (state) => state.studyRecords.isLoading;
export const selectStudyRecordsError = (state) => state.studyRecords.error;
export const selectLastUpdated = (state) => state.studyRecords.lastUpdated;

// Helper selectors
export const selectUserRank = (state) => {
  const leaderboard = selectLeaderboard(state);
  const userRecord = selectUserRecord(state);
  if (!userRecord || leaderboard.length === 0) return null;
  
  return leaderboard.findIndex(record => record.userId === userRecord.userId) + 1;
};

export default studyRecordsSlice.reducer; 