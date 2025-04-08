import { createSlice } from "@reduxjs/toolkit";
import {
  getPosts,
  getStats,
  getVideos,
  getWatchHistory,
  removeFromHistory,
} from "../actions/dashboard";

// --- //

const initialState = {
  stats: null,
  videos: [],
  posts: [],
  watchHistory: [],
  isLoading: false,
  isError: null,
};

const userSlice = createSlice({
  name: "post",
  initialState,
  extraReducers: (builder) => {
    // get stats
    builder
      .addCase(getStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
        state.stats = null;
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.stats = action.payload?.data;
      });

    // get videos
    builder
      .addCase(getVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
        state.videos = [];
      })
      .addCase(getVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.videos = action.payload?.data;
      });

    // get posts
    builder
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
        state.posts = [];
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.posts = action.payload?.data;
      });

    // get watch history
    builder
      .addCase(getWatchHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWatchHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
        state.watchHistory = [];
      })
      .addCase(getWatchHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.watchHistory = action.payload?.data;
      });

    // remove from watch history
    builder
      .addCase(removeFromHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(removeFromHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.watchHistory = state.watchHistory.filter(
          (video) => video?._id !== action.payload?.data?._id
        );
      });
  },
});

export let { reducer } = userSlice;
