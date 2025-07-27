import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLearning: [], // Array of drug IDs
  finished: [], // Array of drug IDs
  drugScores: {}, // Object mapping drug IDs to highest scores (for future use)
};

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    addToCurrentLearning: (state, action) => {
      const drugId = action.payload;
      if (!state.currentLearning.includes(drugId)) {
        state.currentLearning.push(drugId);
        // Remove from finished if it was there
        state.finished = state.finished.filter(id => id !== drugId);
      }
    },
    removeFromCurrentLearning: (state, action) => {
      const drugId = action.payload;
      state.currentLearning = state.currentLearning.filter(id => id !== drugId);
    },
    moveToFinished: (state, action) => {
      const drugId = action.payload;
      // Remove from current learning
      state.currentLearning = state.currentLearning.filter(id => id !== drugId);
      // Add to finished if not already there
      if (!state.finished.includes(drugId)) {
        state.finished.push(drugId);
      }
    },
    moveToCurrentLearning: (state, action) => {
      const drugId = action.payload;
      // Remove from finished
      state.finished = state.finished.filter(id => id !== drugId);
      // Add to current learning if not already there
      if (!state.currentLearning.includes(drugId)) {
        state.currentLearning.push(drugId);
      }
    },
    removeFromFinished: (state, action) => {
      const drugId = action.payload;
      state.finished = state.finished.filter(id => id !== drugId);
    },
    updateDrugScore: (state, action) => {
      const { drugId, score } = action.payload;
      // Store the highest score for this drug
      const currentScore = state.drugScores[drugId] || 0;
      if (score > currentScore) {
        state.drugScores[drugId] = score;
      }
    },
    clearAllLearning: (state) => {
      state.currentLearning = [];
      state.finished = [];
      state.drugScores = {};
    },
    // New action to sync with backend data
    syncWithBackend: (state, action) => {
      const { currentLearning = [], finished = [], drugScores = {} } = action.payload;
      state.currentLearning = currentLearning;
      state.finished = finished;
      state.drugScores = drugScores;
    },
  },
});

export const {
  addToCurrentLearning,
  removeFromCurrentLearning,
  moveToFinished,
  moveToCurrentLearning,
  removeFromFinished,
  updateDrugScore,
  clearAllLearning,
  syncWithBackend,
} = learningSlice.actions;

// Selectors
export const selectCurrentLearning = (state) => state.learning.currentLearning;
export const selectFinished = (state) => state.learning.finished;
export const selectDrugScores = (state) => state.learning.drugScores;

export const selectCurrentLearningCount = (state) => state.learning.currentLearning.length;
export const selectFinishedCount = (state) => state.learning.finished.length;
export const selectTotalScore = (state) => {
  const scores = Object.values(state.learning.drugScores);
  return scores.reduce((total, score) => total + score, 0);
};

export const selectIsInLearningList = (state, drugId) => {
  return state.learning.currentLearning.includes(drugId) || 
         state.learning.finished.includes(drugId);
};

export const selectIsInCurrentLearning = (state, drugId) => {
  return state.learning.currentLearning.includes(drugId);
};

export const selectIsFinished = (state, drugId) => {
  return state.learning.finished.includes(drugId);
};

export const selectDrugScore = (state, drugId) => {
  return state.learning.drugScores[drugId] || 0;
};

// Helper selector to get study record data for backend sync
export const selectStudyRecordData = (state) => ({
  currentLearning: state.learning.currentLearning.length,
  finishedLearning: state.learning.finished.length,
  totalScore: selectTotalScore(state),
});

export default learningSlice.reducer; 