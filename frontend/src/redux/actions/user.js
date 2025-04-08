import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleRequestError } from "../../constants";

// --- //

let postSignup = createAsyncThunk(
  "postSignup",
  async (formData, { rejectWithValue }) => {
    try {
      let { data } = await axios.post("/api/v1/user/signup", formData, {
        withCredentials: true,
      });

      return data;
    } catch (error) {
      return rejectWithValue(handleRequestError(error, "Signup failed!"));
    }
  }
);

let postSignin = createAsyncThunk(
  "postSignin",
  async (userData, { rejectWithValue }) => {
    try {
      let { data } = await axios.post("/api/v1/user/signin", userData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      return data;
    } catch (error) {
      return rejectWithValue(handleRequestError(error, "User signin failed!"));
    }
  }
);

let getSignout = createAsyncThunk(
  "getSignout",
  async (_, { rejectWithValue }) => {
    try {
      let { data } = await axios.get("/api/v1/user/signout", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      return data;
    } catch (error) {
      return rejectWithValue(handleRequestError(error, "Signout failed!"));
    }
  }
);

let fetchCurrentUser = createAsyncThunk(
  "fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      let { data } = await axios.get("/api/v1/user/currentuser/me", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to fetch user!")
      );
    }
  }
);

let fetchSingleUser = createAsyncThunk(
  "fetchSingleUser",
  async (userID, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(
        `/api/v1/user/requested-user?userID=${userID}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to fetch user!")
      );
    }
  }
);

let patchUpdateUserInfo = createAsyncThunk(
  "patchUpdateUserInfo",
  async (userData, { rejectWithValue }) => {
    try {
      let { data } = await axios.patch(
        "/api/v1/user/currentuser/me",
        userData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to update user info!")
      );
    }
  }
);

let patchChangePassword = createAsyncThunk(
  "patchChangePassword",
  async (userData, { rejectWithValue }) => {
    try {
      let { data } = await axios.patch(
        "/api/v1/user/changepassword",
        userData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to change password!")
      );
    }
  }
);

let patchUpdateAvatar = createAsyncThunk(
  "patchUpdateAvatar",
  async (userData, { rejectWithValue }) => {
    try {
      let { data } = await axios.patch(
        "/api/v1/user/currentuser/avatar",
        userData,
        {
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to update avatar!")
      );
    }
  }
);

let patchUpdateCoverImage = createAsyncThunk(
  "patchUpdateCoverImage",
  async (userData, { rejectWithValue }) => {
    try {
      let { data } = await axios.patch(
        "/api/v1/user/currentuser/coverimage",
        userData,
        {
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to update cover image!")
      );
    }
  }
);

export {
  postSignup,
  postSignin,
  getSignout,
  fetchCurrentUser,
  fetchSingleUser,
  patchUpdateUserInfo,
  patchChangePassword,
  patchUpdateAvatar,
  patchUpdateCoverImage,
};
