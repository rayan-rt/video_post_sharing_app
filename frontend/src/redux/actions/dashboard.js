import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleRequestError } from "../../constants";

const getStats = createAsyncThunk(
  "getStats",
  async (userID, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(
        `/api/v1/dashboard/stats?userID=${userID}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(handleRequestError(error, "Failed to get stats"));
    }
  }
);

const getVideos = createAsyncThunk(
  "getVideos",
  async (userID, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(
        `/api/v1/dashboard/videos?userID=${userID}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(handleRequestError(error, "Failed to get videos"));
    }
  }
);

const getPosts = createAsyncThunk(
  "getPosts",
  async (userID, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(
        `/api/v1/dashboard/posts?userID=${userID}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(handleRequestError(error, "Failed to get posts"));
    }
  }
);

const getWatchHistory = createAsyncThunk(
  "getWatchHistory",
  async (userID, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(
        `/api/v1/dashboard/history?userID=${userID}`,
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
        handleRequestError(error, "Failed to get watch history")
      );
    }
  }
);

const removeFromHistory = createAsyncThunk(
  "removeFromHistory",
  async (videoID, { rejectWithValue }) => {
    try {
      let { data } = await axios.delete(
        `/api/v1/dashboard/history?videoID=${videoID}`,
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
        handleRequestError(error, "Failed to remove from watch history")
      );
    }
  }
);

export { getStats, getVideos, getPosts, getWatchHistory, removeFromHistory };
