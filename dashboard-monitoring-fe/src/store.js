import { configureStore } from "@reduxjs/toolkit";
import authenSlice from "./services/authen/authenSlice";

export const store = configureStore({
  reducer: {
    authen: authenSlice,
  },
});
