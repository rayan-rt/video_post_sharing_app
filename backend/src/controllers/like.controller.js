import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { ResHandler } from "../utils/resHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// --- //

const getLikedVideos = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;

  let likes = await Like.aggregate([
    {
      $match: { likedBy: new mongoose.Types.ObjectId(currentUserID) },
    },
    {
      $lookup: {
        from: "videos",
        foreignField: "_id",
        localField: "video",
        as: "video",
      },
    },
    { $unwind: "$video" },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "video.owner",
        as: "videoOwner",
      },
    },
    { $unwind: "$videoOwner" },
    {
      $project: {
        _id: 1,
        "video._id": 1,
        "video.thumbnail": 1,
        "video.title": 1,
        "video.views": 1,
        "video.createdAt": 1,
        "videoOwner._id": 1,
        "videoOwner.username": 1,
        "videoOwner.avatar": 1,
      },
    },
    {
      // cases where the video is not found
      $match: {
        video: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: null, // Group by null to aggregate all documents
        totalViews: { $sum: "$video.views" },
        totalLikedVideos: { $sum: 1 },
        videos: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        totalViews: 1,
        totalLikedVideos: 1,
        videos: 1,
      },
    },
  ]);

  if (!likes || likes.length === 0) {
    return res
      .status(200)
      .json(new ResHandler(200, [], "No liked video found"));
  }

  return res
    .status(200)
    .json(new ResHandler(200, likes[0], "Liked videos fetched"));
});

const getLikedPosts = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;

  let likes = await Like.aggregate([
    {
      $match: { likedBy: new mongoose.Types.ObjectId(currentUserID) },
    },
    {
      $lookup: {
        from: "posts",
        foreignField: "_id",
        localField: "post",
        as: "post",
      },
    },
    { $unwind: "$post" },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "post.owner",
        as: "postOwner",
      },
    },
    { $unwind: "$postOwner" },
    {
      $project: {
        _id: 1,
        "post._id": 1,
        "post.content": 1,
        "post.createdAt": 1,
        "postOwner._id": 1,
        "postOwner.username": 1,
        "postOwner.avatar": 1,
      },
    },
    {
      $match: {
        post: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: null,
        totalLikedPosts: { $sum: 1 },
        posts: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        totalLikedPosts: 1,
        posts: 1,
      },
    },
  ]);

  if (!likes || likes.length === 0) {
    return res
      .status(200)
      .json(new ResHandler(200, [], "No liked posts found"));
  }

  return res
    .status(200)
    .json(new ResHandler(200, likes[0], "Liked posts fetched"));
});

const getLikedComments = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;

  let likes = await Like.aggregate([
    {
      $match: { likedBy: new mongoose.Types.ObjectId(currentUserID) },
    },
    {
      $lookup: {
        from: "comments",
        foreignField: "_id",
        localField: "comment",
        as: "comment",
      },
    },
    { $unwind: "$comment" },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "comment.owner",
        as: "commentOwner",
      },
    },
    { $unwind: "$commentOwner" },
    {
      $project: {
        _id: 1,
        "comment._id": 1,
        "comment.content": 1,
        "comment.createdAt": 1,
        "commentOwner._id": 1,
        "commentOwner.username": 1,
        "commentOwner.avatar": 1,
      },
    },
    {
      $match: {
        comment: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: null,
        totalLikedComments: { $sum: 1 },
        comments: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        totalLikedComments: 1,
        comments: 1,
      },
    },
  ]);

  if (!likes || likes.length === 0) {
    return res
      .status(200)
      .json(new ResHandler(200, [], "No liked comment found"));
  }

  return res
    .status(200)
    .json(new ResHandler(200, likes[0], "Liked comments fetched"));
});

const toggleVideoLike = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  const { videoID } = req.query;

  let temp_video = await Video.findById(videoID);
  if (!temp_video) throw new ErrorHandler(404, "Video not found");

  let isAlreadyLiked = await Like.findOne({
    likedBy: currentUserID,
    video: temp_video._id,
  });

  if (isAlreadyLiked) {
    await Like.findOneAndDelete({
      likedBy: currentUserID,
      video: temp_video._id,
    });

    return res.status(200).json(new ResHandler(200, [], "Video dis-liked"));
  } else {
    await Like.create({
      likedBy: currentUserID,
      video: temp_video._id,
    });

    return res.status(201).json(new ResHandler(201, [], "Video liked"));
  }
});

const togglePostLike = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  const { postID } = req.query;

  let temp_post = await Post.findById(postID);
  if (!temp_post) throw new ErrorHandler(404, "Post not found");

  let isAlreadyLiked = await Like.findOne({
    likedBy: currentUserID,
    post: temp_post._id,
  });

  if (isAlreadyLiked) {
    await Like.findOneAndDelete({
      likedBy: currentUserID,
      post: temp_post._id,
    });

    return res.status(200).json(new ResHandler(200, [], "post dis-liked"));
  } else {
    await Like.create({
      likedBy: currentUserID,
      post: temp_post._id,
    });

    return res.status(201).json(new ResHandler(201, [], "post liked"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  const { commentID } = req.query;

  let temp_comment = await Comment.findById(commentID);
  if (!temp_comment) throw new ErrorHandler(404, "comment not found");

  let isAlreadyLiked = await Like.findOne({
    likedBy: currentUserID,
    comment: temp_comment._id,
  });

  if (isAlreadyLiked) {
    await Like.findOneAndDelete({
      likedBy: currentUserID,
      comment: temp_comment._id,
    });

    return res.status(200).json(new ResHandler(200, [], "comment dis-liked"));
  } else {
    await Like.create({
      likedBy: currentUserID,
      comment: temp_comment._id,
    });

    return res.status(201).json(new ResHandler(201, [], "comment liked"));
  }
});

/*

const getPostLikes = asyncHandler(async (req, res) => {
  let { postID } = req.params;

  let temp_post = await Post.findById(postID);
  if (!temp_post) throw new ErrorHandler(404, "Post not found");

  let likes = await Like.aggregate([
    {
      $match: { post: new mongoose.Types.ObjectId(postID) },
    },
    {
      $count: "totalLikes",
    },
  ]);

  if (likes.length === 0) {
    return res
      .status(200)
      .json(new ResHandler(200, { totalLikes: 0 }, "Total likes fetched"));
  }

  return res
    .status(200)
    .json(new ResHandler(200, likes[0], "Total likes fetched"));
});

const getVideoLikes = asyncHandler(async (req, res) => {
  let { videoID } = req.params;

  let temp_video = await Video.findById(videoID);
  if (!temp_video) throw new ErrorHandler(404, "Video not found");

  let likes = await Like.aggregate([
    {
      $match: { video: new mongoose.Types.ObjectId(videoID) },
    },
    {
      $count: "totalLikes",
    },
  ]);

  if (likes.length === 0) {
    return res
      .status(200)
      .json(new ResHandler(200, { totalLikes: 0 }, "Total likes fetched"));
  }

  return res
    .status(200)
    .json(new ResHandler(200, likes[0], "Total likes fetched"));
});

const getCommentLikes = asyncHandler(async (req, res) => {
  let { commentID } = req.query;

  let temp_comment = await Comment.findById(commentID);
  if (!temp_comment) throw new ErrorHandler(404, "comment not found");

  let likes = await Like.aggregate([
    {
      $match: { comment: new mongoose.Types.ObjectId(commentID) },
    },
    {
      $count: "totalLikes",
    },
  ]);

  if (likes.length === 0) {
    return res
      .status(200)
      .json(new ResHandler(200, { totalLikes: 0 }, "Total likes fetched"));
  }

  return res
    .status(200)
    .json(new ResHandler(200, likes[0], "Total likes fetched"));
});

const isVideoLiked = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  let { videoID } = req.query;

  let temp_video = await Video.findById(videoID);
  if (!temp_video) throw new ErrorHandler(404, "Video not found");

  let isLiked = await Like.findOne({
    likedBy: currentUserID,
    video: temp_video._id,
  });

  if (isLiked) {
    return res
      .status(200)
      .json(new ResHandler(200, { isLiked: true }, "Video liked"));
  } else {
    return res
      .status(200)
      .json(new ResHandler(200, { isLiked: false }, "Video not liked"));
  }
});

const isPostLiked = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  let { postID } = req.query;

  let temp_post = await Post.findById(postID);
  if (!temp_post) throw new ErrorHandler(404, "Post not found");

  let isLiked = await Like.findOne({
    likedBy: currentUserID,
    post: temp_post._id,
  });

  if (isLiked) {
    return res
      .status(200)
      .json(new ResHandler(200, { isLiked: true }, "Post liked"));
  } else {
    return res
      .status(200)
      .json(new ResHandler(200, { isLiked: false }, "Post not liked"));
  }
});

*/

export {
  getLikedVideos,
  getLikedPosts,
  getLikedComments,
  toggleVideoLike,
  togglePostLike,
  toggleCommentLike,
  // isVideoLiked,
  // isPostLiked,
  // getPostLikes,
  // getVideoLikes,
  // getCommentLikes,
};
