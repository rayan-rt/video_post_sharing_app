import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/video.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { ResHandler } from "../utils/resHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// --- //

const getChannelStats = asyncHandler(async (req, res) => {
  let { userID } = req.query;

  let temp_user = await User.findById(userID);
  if (!temp_user) throw new ErrorHandler(404, "User not found");

  let subscribers = await Subscription.aggregate([
    {
      $match: { channel: temp_user._id },
    },
    {
      $count: "totalSubscribers",
    },
  ]);

  let videos = await Video.aggregate([
    {
      $match: { owner: temp_user._id },
    },
    {
      $lookup: {
        from: "likes",
        foreignField: "video",
        localField: "_id",
        as: "videoLikes",
      },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: { $size: "$videoLikes" } },
      },
    },
    {
      $project: {
        _id: 0,
        totalVideos: 1,
        totalViews: 1,
        totalLikes: 1,
      },
    },
  ]);

  let posts = await Post.aggregate([
    {
      $match: { owner: temp_user._id },
    },
    {
      $lookup: {
        from: "likes",
        foreignField: "post",
        localField: "_id",
        as: "postLikes",
      },
    },
    {
      $group: {
        _id: null,
        totalPosts: { $sum: 1 },
        totalLikes: { $sum: { $size: "$postLikes" } },
      },
    },
    {
      $project: {
        _id: 0,
        totalPosts: 1,
        totalLikes: 1,
      },
    },
  ]);

  let stats = {
    userEmail: temp_user.email,
    totalSubscribers: subscribers[0]?.totalSubscribers || 0,
    totalVideos: videos[0]?.totalVideos || 0,
    totalVideoViews: videos[0]?.totalViews || 0,
    totalVideoLikes: videos[0]?.totalLikes || 0,
    totalPosts: posts[0]?.totalPosts || 0,
    totalPostLikes: posts[0]?.totalLikes || 0,
    userCreatedAt: temp_user.createdAt,
    userAccount: `http://127.0.0.1:3000/api/v1/user/${temp_user._id}`,
  };

  return res
    .status(200)
    .json(new ResHandler(200, stats, "Channel stats fetched"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  let { userID } = req.query;

  let temp_user = await User.findById(userID);
  if (!temp_user) throw new ErrorHandler(404, "User not found");

  let videos = await Video.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(userID) },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        thumbnail: 1,
        views: 1,
        createdAt: 1,
        duration: 1,
      },
    },
  ]);

  return res.status(200).json(new ResHandler(200, videos, "Videos fetched "));
});

const getChannelPosts = asyncHandler(async (req, res) => {
  let { userID } = req.query;

  let posts = await Post.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(userID) },
    },
    {
      $lookup: {
        from: "comments",
        foreignField: "post",
        localField: "_id",
        as: "postComments",
      },
    },
    {
      $lookup: {
        from: "likes",
        foreignField: "post",
        localField: "_id",
        as: "postLikes",
      },
    },
    {
      $addFields: {
        totalComments: { $size: { $ifNull: ["$postComments", []] } },
        totalLikes: { $size: { $ifNull: ["$postLikes", []] } },
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        createdAt: 1,
        totalComments: 1,
        totalLikes: 1,
      },
    },
  ]);

  return res.status(200).json(new ResHandler(200, posts, "Posts fetched "));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  let { userID } = req.query;

  let user = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userID) },
    },
    {
      $unwind: {
        path: "$watchHistory",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "videos",
        foreignField: "_id",
        localField: "watchHistory",
        as: "watchHistory",
        pipeline: [
          {
            $project: {
              _id: 1,
              thumbnail: 1,
              title: 1,
              views: 1,
              createdAt: 1,
              owner: 1,
            },
          },
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "owner",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $first: "$owner" },
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$watchHistory",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $group: {
        _id: "$_id",
        watchHistory: { $push: "$watchHistory" },
      },
    },
  ]);

  if (!user.length || !user[0].watchHistory.length)
    return res.status(200).json(new ResHandler(200, [], "No Watch History"));

  return res
    .status(200)
    .json(new ResHandler(200, user[0].watchHistory, "Watch History found"));
});

const deleteFromHistory = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  let { videoID } = req.query;

  let temp_video = await Video.findById(videoID);
  if (!temp_video) throw new ErrorHandler(404, "Video not found!");

  await User.findByIdAndUpdate(
    currentUserID,
    {
      $pull: { watchHistory: videoID },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ResHandler(200, {}, "Video deleted from history"));
});

export {
  getChannelStats,
  getChannelVideos,
  getChannelPosts,
  getWatchHistory,
  deleteFromHistory,
};
