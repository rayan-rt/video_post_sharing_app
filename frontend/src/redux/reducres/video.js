import { createSlice } from "@reduxjs/toolkit";
import {
  deleteSingleVideo,
  getAllVideos,
  getSingleVideo,
  getSubscribedUsersVideos,
  patchUpdateVideo,
  postUploadVideo,
} from "../actions/video";

// --- //

const initialState = {
  videos: [],
  video: null,
  isLoading: false,
  isError: null,
};

const userSlice = createSlice({
  name: "video",
  initialState,
  extraReducers: (builder) => {
    // create video
    builder
      .addCase(postUploadVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postUploadVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(postUploadVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.videos.push(action.payload?.data);
      });

    // update video
    builder
      .addCase(patchUpdateVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(patchUpdateVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(patchUpdateVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.videos = state.videos.map((video) =>
          video._id === action.payload?.data._id ? action.payload?.data : video
        );
      });

    // delete video
    builder
      .addCase(deleteSingleVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSingleVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(deleteSingleVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.videos = state.videos.filter(
          (video) => video._id !== action.payload?.data._id
        );
      });

    // get all videos
    builder
      .addCase(getAllVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.videos = action.payload?.data;
      });

    // get subscribed users videos
    builder
      .addCase(getSubscribedUsersVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSubscribedUsersVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(getSubscribedUsersVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.videos = action.payload?.data;
      });

    // get single video
    builder
      .addCase(getSingleVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(getSingleVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.video = action.payload?.data;
      });
  },
});

export let { reducer } = userSlice;
