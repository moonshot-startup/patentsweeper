import { configureStore } from "@reduxjs/toolkit";
import keywordsReducer from "./keywordsSlice";
import queryIdReducer from "./pdfDataSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      keywords: keywordsReducer,
      queryId: queryIdReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
