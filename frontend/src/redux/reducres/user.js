import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCurrentUser,
  fetchSingleUser,
  getSignout,
  patchChangePassword,
  patchUpdateAvatar,
  patchUpdateCoverImage,
  patchUpdateUserInfo,
  postSignin,
  postSignup,
} from "../actions/user";

// --- //

const initialState = {
  users: [],
  user: null,
  requestedUser: null,
  isAuthenticated: false,
  isLoading: false,
  isError: null, // Store error message
};

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    // signup
    builder
      .addCase(postSignup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postSignup.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isError = action.payload; // Store error message
      })
      .addCase(postSignup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.user = action.payload?.data;
        state.isAuthenticated = true;
      });

    // signin
    builder
      .addCase(postSignin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postSignin.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isError = action.payload;
      })
      .addCase(postSignin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.data;
        state.isAuthenticated = true;
        state.isError = null;
      });

    // signout
    builder
      .addCase(getSignout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSignout.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isError = action.payload;
      })
      .addCase(getSignout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isError = null;
      });

    // fetch current user
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isError = action.payload;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.data;
        state.isAuthenticated = true;
        state.isError = null;
      });

    // fetch single/requested user
    builder
      .addCase(fetchSingleUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSingleUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
        state.requestedUser = null;
      })
      .addCase(fetchSingleUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.requestedUser = action.payload?.data;
      });

    // update user info
    builder
      .addCase(patchUpdateUserInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(patchUpdateUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isError = action.payload;
      })
      .addCase(patchUpdateUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.user = { ...state.user, ...action.payload };
      });

    // change password
    builder
      .addCase(patchChangePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(patchChangePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isError = action.payload;
      })
      .addCase(patchChangePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.user = { ...state.user, ...action.payload };
      });

    // update avatar
    builder
      .addCase(patchUpdateAvatar.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(patchUpdateAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isError = action.payload;
      })
      .addCase(patchUpdateAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.user = { ...state.user, ...action.payload };
      });

    // update cover image
    builder
      .addCase(patchUpdateCoverImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(patchUpdateCoverImage.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isError = action.payload;
      })
      .addCase(patchUpdateCoverImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.user = { ...state.user, ...action.payload };
      });
  },
});

export let { reducer } = userSlice;
