import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleRequestError } from "../../constants";

let postCommentOnVideo = createAsyncThunk(
  "postCommentOnVideo",
  async (commentData, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(`/api/v1/comment/video`, commentData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to post comment on video!")
      );
    }
  }
);

let postCommentOnPost = createAsyncThunk(
  "postCommentOnPost",
  async (commentData, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(`/api/v1/comment/post`, commentData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to post comment on post!")
      );
    }
  }
);

let deleteComment = createAsyncThunk(
  "deleteComment",
  async (commentID, { rejectWithValue }) => {
    try {
      let { data } = await axios.delete(`/api/v1/comment/${commentID}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to delete comment!")
      );
    }
  }
);

let toggleLikeUnlike = createAsyncThunk(
  "toggleLikeUnlike",
  async (commentID, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(
        `/api/v1/like/toggle/comment/${commentID}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error, "Failed to toggle like/unlike!");
    }
  }
);

const patchUpdateComment = createAsyncThunk(
  "patchUpdateComment",
  async ({ commentID, content }, { rejectWithValue }) => {
    try {
      let { data } = await axios.patch(
        `/api/v1/comment/${commentID}`,
        { content },
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
        handleRequestError(error, "Failed to update comment!")
      );
    }
  }
);

export {
  postCommentOnVideo,
  postCommentOnPost,
  deleteComment,
  patchUpdateComment,
  toggleLikeUnlike,
};
