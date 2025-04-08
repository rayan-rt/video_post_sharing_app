import mongoose from "mongoose";
import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { ResHandler } from "../utils/resHandler.js";

// --- //

const getAllPosts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 5,
    sortBy = "createdAt",
    sortType = "desc",
    userID,
  } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  let posts = await Post.aggregate([
    {
      $match: {
        ...(userID && { owner: new mongoose.Types.ObjectId(userID) }),
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "owner",
        as: "ownerInfo",
      },
    },
    { $unwind: "$ownerInfo" },
    { $sort: { [sortBy]: sortType === "asc" ? 1 : -1 } },
    { $skip: (pageNumber - 1) * limitNumber },
    { $limit: limitNumber },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        ownerInfo: { _id: 1, username: 1, avatar: 1 },
      },
    },
  ]);

  return res.status(200).json(new ResHandler(200, posts, "posts found"));
});

const createPost = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  let { content } = req.body;

  if (content?.trim().length === 0) throw new ErrorHandler(404, "null post!");

  let post = await Post.create({ content, owner: currentUserID });

  return res.status(201).json(new ResHandler(201, post, "post created"));
});

const getPost = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  let { postID } = req.params;

  let temp_post = await Post.findById(postID);
  if (!temp_post) throw new ErrorHandler(404, "Post not found!");

  let posts = await Post.aggregate([
    {
      $match: { _id: temp_post._id },
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
    { $unwind: "$owner" },
    {
      $lookup: {
        from: "likes",
        foreignField: "post",
        localField: "_id",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        foreignField: "post",
        localField: "_id",
        as: "comments",
        pipeline: [
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "owner",
              as: "owner",
            },
          },
          {
            $lookup: {
              from: "likes",
              foreignField: "comment",
              localField: "_id",
              as: "commentLikes",
            },
          },
          {
            $addFields: {
              likesCount: { $size: "$commentLikes" },
              isLikedByCurrentUser: {
                $in: [currentUserID, "$commentLikes.likedBy"],
              },
              owner: { $arrayElemAt: ["$owner", 0] },
            },
          },
          {
            $project: {
              _id: 1,
              content: 1,
              createdAt: 1,
              likesCount: 1,
              isLikedByCurrentUser: 1,
              "owner._id": 1,
              "owner.username": 1,
              "owner.avatar": 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        totalLikes: { $size: "$likes" },
        totalComments: { $size: "$comments" },
        isLikedByCurrentUser: {
          $in: [currentUserID, "$likes.likedBy"],
        },
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        createdAt: 1,
        totalLikes: 1,
        totalComments: 1,
        isLikedByCurrentUser: 1,
        owner: 1,
        comments: 1,
      },
    },
  ]);

  if (!posts || !posts?.length) throw new ErrorHandler(404, "Post Not Found!");

  return res.status(200).json(new ResHandler(200, posts[0], "Post found"));
});

const updatePost = asyncHandler(async (req, res) => {
  const { postID } = req.params;
  let { content } = req.body;

  if (content?.trim().length === 0) throw new ErrorHandler(404, "null post!");

  let post = await Post.findByIdAndUpdate(postID, { content }, { new: true });
  if (!post) throw new ErrorHandler(404, "post not found!");

  return res.status(200).json(new ResHandler(200, post, "post updated"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postID } = req.params;

  await Post.findByIdAndDelete(postID);

  return res.status(200).json(new ResHandler(200, {}, "post deleted"));
});

export { getAllPosts, createPost, getPost, updatePost, deletePost };
