import { createSlice } from "@reduxjs/toolkit";
import {
  postCreatePost,
  getAllPosts,
  getSinglePost,
  patchUpdatePost,
  deletePost,
} from "../actions/post";

// --- //

const initialState = {
  posts: [],
  post: null,
  isLoading: false,
  isError: null,
};

const userSlice = createSlice({
  name: "post",
  initialState,
  extraReducers: (builder) => {
    // create post
    builder
      .addCase(postCreatePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postCreatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(postCreatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.posts.push(action.payload?.data);
      });

    // get all posts
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.posts = action.payload?.data;
      });

    // update post
    builder
      .addCase(patchUpdatePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(patchUpdatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(patchUpdatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.posts = state.posts.map((post) =>
          post._id === action.payload?.data?._id ? action.payload?.data : post
        );
      });

    // delete post
    builder
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload?.data?._id
        );
      });

    // get single/requested post
    builder
      .addCase(getSinglePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSinglePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(getSinglePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.post = action.payload?.data;
      });
  },
});

export let { reducer } = userSlice;
