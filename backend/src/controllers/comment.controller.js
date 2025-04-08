import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { ResHandler } from "../utils/resHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// --- //

const getVideoComments = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  const { videoID, page = 1, limit = 15 } = req.query;

  let pageNumber = Number(page);
  let limitNumber = Number(limit);

  let temp_video = await Video.findById(videoID);
  if (!temp_video) throw new ErrorHandler(404, "Video not found");

  let comments = await Comment.aggregate([
    {
      $match: { video: temp_video._id },
    },
    { $skip: (pageNumber - 1) * limitNumber },
    { $limit: limitNumber },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "owner",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $lookup: {
        from: "likes",
        foreignField: "comment",
        localField: "_id",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        isLikedByCurrentUser: {
          $in: [new mongoose.Types.ObjectId(currentUserID), "$likes.likedBy"],
        },
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        createdAt: 1,
        owner: { _id: 1, username: 1, avatar: 1 },
        likesCount: 1,
        isLikedByCurrentUser: 1,
      },
    },
  ]);

  if (!comments || comments.length === 0)
    return res.status(200).json(new ResHandler(200, [], "No comment yet!"));

  return res
    .status(200)
    .json(new ResHandler(200, comments, "Comments fetched"));
});

const addCommentOnVideo = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  let { videoID, content } = req.body;

  let temp_video = await Video.findById(videoID);
  if (!temp_video) throw new ErrorHandler(404, "Video not found");

  let comment = await Comment.create({
    content,
    owner: currentUserID,
    video: temp_video._id,
  });
  if (!comment) throw new ErrorHandler(500, "Failed to create comment!");

  return res
    .status(201)
    .json(new ResHandler(201, comment, "Comment added on video"));
});

const getPostComments = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  const { postID, page = 1, limit = 15 } = req.query;

  let pageNumber = Number(page);
  let limitNumber = Number(limit);

  let temp_post = await Post.findById(postID);
  if (!temp_post) throw new ErrorHandler(404, "Post not found");

  let comments = await Comment.aggregate([
    {
      $match: { post: temp_post._id },
    },
    { $skip: (pageNumber - 1) * limitNumber },
    { $limit: limitNumber },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "owner",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $lookup: {
        from: "likes",
        foreignField: "comment",
        localField: "_id",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        isLikedByCurrentUser: {
          $in: [new mongoose.Types.ObjectId(currentUserID), "$likes.likedBy"],
        },
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        createdAt: 1,
        owner: { _id: 1, username: 1, avatar: 1 },
        likesCount: 1,
        isLikedByCurrentUser: 1,
      },
    },
  ]);

  if (!comments || comments.length === 0)
    return res.status(200).json(new ResHandler(200, [], "No comment yet!"));

  return res
    .status(200)
    .json(new ResHandler(200, comments, "Comments fetched"));
});

const addCommentOnPost = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  let { postID, content } = req.body;

  let temp_post = await Post.findById(postID);
  if (!temp_post) throw new ErrorHandler(404, "Post not found");

  let comment = await Comment.create({
    content,
    owner: currentUserID,
    post: temp_post._id,
  });
  if (!comment) throw new ErrorHandler(500, "Failed to create comment!");

  return res
    .status(201)
    .json(new ResHandler(201, comment, "Comment added on post"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentID } = req.params;
  let { content } = req.body;

  if (!content) {
    return res.status(200).json(new ResHandler(200, {}, "nothing to update"));
  }

  let comment = await Comment.findByIdAndUpdate(commentID, { content });
  if (!comment) throw new ErrorHandler(500, "Comment not found!");

  return res.status(200).json(new ResHandler(200, comment, "Comment updated"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentID } = req.params;

  await Comment.findByIdAndDelete(commentID);

  return res.status(200).json(new ResHandler(200, {}, "Comment deleted"));
});

export {
  getVideoComments,
  addCommentOnVideo,
  getPostComments,
  addCommentOnPost,
  updateComment,
  deleteComment,
};
