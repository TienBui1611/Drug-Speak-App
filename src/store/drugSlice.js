import { createSlice, createSelector } from '@reduxjs/toolkit';
import { drugData, drugCategory } from '../data/drugData';

const initialState = {
  drugs: drugData,
  categories: drugCategory,
  loading: false,
  error: null,
};

const drugSlice = createSlice({
  name: 'drugs',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setLoading, setError, clearError } = drugSlice.actions;

// Basic selectors
export const selectAllDrugs = (state) => state.drugs.drugs;
export const selectAllCategories = (state) => state.drugs.categories;

// Memoized selectors
export const selectDrugById = createSelector(
  [selectAllDrugs, (state, drugId) => drugId],
  (drugs, drugId) => drugs.find(drug => drug.id === drugId)
);

export const selectDrugsByCategory = createSelector(
  [selectAllDrugs, (state, categoryId) => categoryId],
  (drugs, categoryId) => drugs.filter(drug => drug.categories.includes(categoryId))
);

export const selectCategoryById = createSelector(
  [selectAllCategories, (state, categoryId) => categoryId],
  (categories, categoryId) => categories[categoryId]
);

export default drugSlice.reducer; 