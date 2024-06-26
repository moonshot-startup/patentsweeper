import { configureStore } from "@reduxjs/toolkit";
import keywordsReducer from "./keywordsSlice";
import pdfDateReducer from "./pdfDataSlice";
import patentsReducer from "./bestPatentsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      keywords: keywordsReducer,
      pdfData: pdfDateReducer,
      similarPatents: patentsReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
