import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleRequestError } from "../../constants";

const postCreatePlaylist = createAsyncThunk(
  "postCreatePlaylist",
  async (playlistData, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(`/api/v1/playlist`, playlistData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to create playlist")
      );
    }
  }
);

const getUserPlaylists = createAsyncThunk(
  "getUserPlaylists",
  async (_, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(`/api/v1/playlist/`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to get playlists")
      );
    }
  }
);

const getPlaylistByID = createAsyncThunk(
  "getPlaylistByID",
  async (playlistID, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(`/api/v1/playlist/${playlistID}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to get playlist")
      );
    }
  }
);

const patchUpdatePlaylist = createAsyncThunk(
  "patchUpdatePlaylist",
  async ({ playlistID, playlistData }, { rejectWithValue }) => {
    try {
      let { data } = await axios.patch(
        `/api/v1/playlist/${playlistID}`,
        playlistData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to update playlist")
      );
    }
  }
);

const deletePlaylist = createAsyncThunk(
  "deletePlaylist",
  async (playlistID, { rejectWithValue }) => {
    try {
      let { data } = await axios.delete(`/api/v1/playlist/${playlistID}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to delete playlist")
      );
    }
  }
);

const addOrRemoveVideoFromPlaylist = createAsyncThunk(
  "removeVideoFromPlaylist",
  async ({ videoID, playlistID }, { rejectWithValue }) => {
    try {
      let { data } = await axios.patch(
        `/api/v1/playlist/add_remove?videoID=${videoID}&playlistID=${playlistID}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to add or remove video from playlist")
      );
    }
  }
);

export {
  postCreatePlaylist,
  getUserPlaylists,
  getPlaylistByID,
  patchUpdatePlaylist,
  deletePlaylist,
  addOrRemoveVideoFromPlaylist,
};
