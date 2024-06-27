import { createSlice } from "@reduxjs/toolkit";

export const patentsSlice = createSlice({
  name: "patents",
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
export const { update } = patentsSlice.actions;

export default patentsSlice.reducer;
