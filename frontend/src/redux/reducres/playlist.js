import { createSlice } from "@reduxjs/toolkit";
import {
  postCreatePlaylist,
  getUserPlaylists,
  getPlaylistByID,
  patchUpdatePlaylist,
  deletePlaylist,
  addOrRemoveVideoFromPlaylist,
} from "../actions/playlist";

const initialState = {
  playlists: [],
  playlist: null,
  isLoading: false,
  isError: null,
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  extraReducers: (builder) => {
    // ✅ Create playlist
    builder
      .addCase(postCreatePlaylist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postCreatePlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(postCreatePlaylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.playlists.push(action.payload?.data);
      });

    // ✅ Get user playlists
    builder
      .addCase(getUserPlaylists.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserPlaylists.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(getUserPlaylists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.playlists = action.payload?.data;
      });

    // ✅ Get playlist by ID
    builder
      .addCase(getPlaylistByID.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPlaylistByID.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(getPlaylistByID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.playlist = action.payload?.data;
      });

    // ✅ Update playlist
    builder
      .addCase(patchUpdatePlaylist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(patchUpdatePlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(patchUpdatePlaylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.playlists = state.playlists.map((playlist) =>
          playlist._id === action.payload?.data?._id
            ? action.payload?.data
            : playlist
        );
      });

    // ✅ Delete playlist
    builder
      .addCase(deletePlaylist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.playlists = state.playlists.filter(
          (playlist) => playlist._id !== action.payload?.data?._id
        );
      });

    // ✅ Add or remove video from playlist
    builder
      .addCase(addOrRemoveVideoFromPlaylist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addOrRemoveVideoFromPlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(addOrRemoveVideoFromPlaylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.playlists = state.playlists.map((playlist) =>
          playlist._id === action.payload?.data?._id
            ? action.payload?.data
            : playlist
        );
      });
  },
});

export let { reducer } = playlistSlice;
