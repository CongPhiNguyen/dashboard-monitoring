import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUserInfo: {},
};

export const authenSlice = createSlice({
  name: "authenSlice",
  initialState: {
    isLogin: false,
  },
  reducers: {
    setLoginState: (state, action) => {
      state.isLogin = action.payload;
    },
  },
});

export const { setLoginState } = authenSlice.actions;

export default authenSlice.reducer;
