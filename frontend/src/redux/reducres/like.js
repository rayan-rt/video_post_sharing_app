import { createSlice } from "@reduxjs/toolkit";
import {
  toggleVideoLikeDislike,
  togglePostLikeDislike,
  toggleCommentLikeDislike,
  getLikedVideos,
  getLikedPosts,
  getLikedComments,
  // checkVideoLiked,
  // checkPostLiked,
  // checkCommentLiked,
} from "../actions/like";

// --- //

const initialState = {
  likes: [],
  isLoading: false,
  isError: null,
};

const userSlice = createSlice({
  name: "like",
  initialState,
  extraReducers: (builder) => {
    // get liked videos
    builder
      .addCase(getLikedVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLikedVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(getLikedVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.likes = action.payload?.data;
      });

    // get liked posts
    builder
      .addCase(getLikedPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLikedPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(getLikedPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.likes = action.payload?.data;
      });

    // get liked comments
    builder
      .addCase(getLikedComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLikedComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(getLikedComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.likes = action.payload?.data;
      });

    // toggle like/dislike on video
    builder
      .addCase(toggleVideoLikeDislike.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleVideoLikeDislike.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(toggleVideoLikeDislike.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.likes = action.payload?.data;
      });

    // toggle like/dislike on post
    builder
      .addCase(togglePostLikeDislike.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(togglePostLikeDislike.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(togglePostLikeDislike.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.likes = action.payload?.data;
      });

    // toggle like/dislike on comment
    builder
      .addCase(toggleCommentLikeDislike.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleCommentLikeDislike.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(toggleCommentLikeDislike.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.likes = action.payload?.data;
      });
  },
});

export let { reducer } = userSlice;
