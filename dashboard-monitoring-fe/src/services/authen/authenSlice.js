import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUserInfo: {},
};

export const authenSlice = createSlice({
  name: "authen",
  initialState,
  reducers: {
    setCurrentUserInfo: (state, action) => {
      state.currentUserInfo = action.payload;
    },
  },
});

export const { setCurrentUserInfo } = authenSlice.actions;

export default authenSlice.reducer;
