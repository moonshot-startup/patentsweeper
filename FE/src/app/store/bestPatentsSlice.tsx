import { createSlice } from "@reduxjs/toolkit";

export const bestPatentsSlice = createSlice({
  name: "bestPatents",
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
export const { update } = bestPatentsSlice.actions;

export default bestPatentsSlice.reducer;
