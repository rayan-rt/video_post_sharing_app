import { createSlice } from "@reduxjs/toolkit";
import {
  checkSubscription,
  getSubscribers,
  toggleSubscription,
  getSubscribedChannels,
} from "../actions/subscription";

// --- //

const initialState = {
  mySubscribers: [],
  mySubscriptions: [],
  subscription: null,
  isLoading: false,
  isError: null,
};

const userSlice = createSlice({
  name: "subscription",
  initialState,
  extraReducers: (builder) => {
    // toggle subscription
    builder
      .addCase(toggleSubscription.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.mySubscriptions = state.mySubscriptions.some(
          (sub) => sub._id === action.payload?.data?._id
        )
          ? state.mySubscriptions.filter(
              (sub) => sub._id !== action.payload?.data._id
            )
          : [...state.mySubscriptions, action.payload?.data];
      });

    // get subscription
    builder
      .addCase(getSubscribedChannels.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSubscribedChannels.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(getSubscribedChannels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.mySubscriptions = action.payload?.data;
      });

    //  get subscribers
    builder
      .addCase(getSubscribers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSubscribers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(getSubscribers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.mySubscribers = action.payload?.data;
      });

    //  check subscription
    builder
      .addCase(checkSubscription.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(checkSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.subscription = action.payload?.data;
      });
  },
});

export let { reducer } = userSlice;
