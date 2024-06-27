import { createSlice } from "@reduxjs/toolkit";

export const keywordsSlice = createSlice({
  name: "keywords",
  initialState: {
    value: [],
  },
  reducers: {
    update: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { update } = keywordsSlice.actions;

export default keywordsSlice.reducer;
