import { createSlice } from "@reduxjs/toolkit";
import {
  postCommentOnVideo,
  postCommentOnPost,
  deleteComment,
  patchUpdateComment,
} from "../actions/comment";

const initialState = {
  comments: [],
  isLoading: false,
  isError: null,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  extraReducers: (builder) => {
    // Create comment on video
    builder
      .addCase(postCommentOnVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postCommentOnVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(postCommentOnVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.comments.push({
          ...action.payload?.data,
          targetType: "video",
        });
      });

    // Create comment on post
    builder
      .addCase(postCommentOnPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postCommentOnPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(postCommentOnPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.comments.push({
          ...action.payload?.data,
          targetType: "post",
        });
      });

    // Delete comment
    builder
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload?.commentID
        );
      });

    // Update comment
    builder
      .addCase(patchUpdateComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(patchUpdateComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(patchUpdateComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.comments = state.comments.map((comment) =>
          comment._id === action.payload?.data?._id
            ? { ...comment, ...action.payload?.data }
            : comment
        );
      });
  },
});

export let { reducer } = commentSlice;
