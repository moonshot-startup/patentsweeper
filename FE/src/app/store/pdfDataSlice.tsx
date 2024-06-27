import { createSlice } from "@reduxjs/toolkit";

export const pdfDateSlice = createSlice({
  name: "pdfData",
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
export const { update } = pdfDateSlice.actions;

export default pdfDateSlice.reducer;
