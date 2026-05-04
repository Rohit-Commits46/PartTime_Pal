import { createSlice } from '@reduxjs/toolkit';

const suggestionSlice = createSlice({
  name: 'suggestions',
  initialState: {
    data: [],
  },
  reducers: {
    setRecommendationData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setRecommendationData } = suggestionSlice.actions;
export default suggestionSlice.reducer;
