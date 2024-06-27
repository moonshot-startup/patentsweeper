import { createSlice } from "@reduxjs/toolkit";

export const queryIdSlice = createSlice({
  name: "queryId",
  initialState: {
    value: null,
  },
  reducers: {
    update: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { update } = queryIdSlice.actions;

export default queryIdSlice.reducer;
