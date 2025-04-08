import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { handleRequestError } from "../../constants";

const toggleVideoLikeDislike = createAsyncThunk(
  "toggleVideoLikeUnlike",
  async (videoID, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(
        `/api/v1/like/toggle/video?videoID=${videoID}`,
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
        handleRequestError(error, "Failed to toggle like/dislike on Video!")
      );
    }
  }
);

const togglePostLikeDislike = createAsyncThunk(
  "togglePostLikeUnlike",
  async (postID, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(
        `/api/v1/like/toggle/post?postID=${postID}`,
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
        handleRequestError(error, "Failed to toggle like/dislike on Post!")
      );
    }
  }
);

const toggleCommentLikeDislike = createAsyncThunk(
  "toggleCommentLikeDislike",
  async (commentID, { rejectWithValue }) => {
    try {
      let { data } = await axios.post(
        `/api/v1/like/toggle/comment?commentID=${commentID}`,
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
        handleRequestError(error, "Failed to toggle like/dislike on Comment!")
      );
    }
  }
);

const getLikedVideos = createAsyncThunk(
  "getLikedVideos",
  async (_, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(`/api/v1/like/videos`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to get liked videos!")
      );
    }
  }
);

const getLikedPosts = createAsyncThunk(
  "getLikedPosts",
  async (_, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(`/api/v1/like/posts`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to get liked posts!")
      );
    }
  }
);

const getLikedComments = createAsyncThunk(
  "getLikedComments",
  async (_, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(`/api/v1/like/comments`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        handleRequestError(error, "Failed to get liked comments!")
      );
    }
  }
);

/*

const checkVideoLiked = createAsyncThunk(
  "checkVideoLiked",
  async (videoID, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(`/api/v1/like/isvideoliked/${videoID}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log("data:", data);

      return data;
    } catch (error) {
      console.log("error:", error);
      return error.response.data.errors
        ? rejectWithValue(error.response.data.errors)
        : rejectWithValue(error.response.statusText);
    }
  }
);

const checkPostLiked = createAsyncThunk(
  "checkPostLiked",
  async (postID, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(`/api/v1/like/ispostliked/${postID}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log("data:", data);

      return data;
    } catch (error) {
      console.log("error:", error);
      return error.response.data.errors
        ? rejectWithValue(error.response.data.errors)
        : rejectWithValue(error.response.statusText);
    }
  }
);

const checkCommentLiked = createAsyncThunk("", async function (_, {rejectWithValue}) {
  try {
    // 
  } catch (error) {
    // 
  }
})

*/

export {
  toggleVideoLikeDislike,
  togglePostLikeDislike,
  toggleCommentLikeDislike,
  getLikedVideos,
  getLikedPosts,
  getLikedComments,
  // checkVideoLiked,
  // checkPostLiked,
  // checkCommentLiked,
};
