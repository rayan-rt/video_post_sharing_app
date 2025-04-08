import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleRequestError } from "../../constants";

const toggleSubscription = createAsyncThunk(
  "toggleSubscription",
  async (channelID, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(
        `/api/v1/subscription/channel?channelID=${channelID}`,
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
        handleRequestError(error, "Failed to toggle subscription!")
      );
    }
  }
);

const checkSubscription = createAsyncThunk(
  "checkSubscription",
  async (channelID, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(
        `/api/v1/subscription/channel?channelID=${channelID}`,
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
        handleRequestError(error, "Failed to check subscription!")
      );
    }
  }
);

const getSubscribers = createAsyncThunk(
  "getSubscribers",
  async (subscriberID, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(
        `/api/v1/subscription/user?subscriberID=${subscriberID}`,
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
        handleRequestError(error, "Failed to get subscribers!")
      );
    }
  }
);

const getSubscribedChannels = createAsyncThunk(
  "getSubscribedChannels",
  async (_, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(
        `/api/v1/subscription/subscribed_channels`,
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
        handleRequestError(error, "Failed to get subscribed channels!")
      );
    }
  }
);

export {
  toggleSubscription,
  checkSubscription,
  getSubscribers,
  getSubscribedChannels,
};
