import mongoose, { mongo } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { ResHandler } from "../utils/resHandler.js";
import { User } from "../models/user.model.js";

// --- //

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 5,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userID,
  } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const matchConditions = {
    isPublished: true,
    ...(userID && { owner: new mongoose.Types.ObjectId(userID) }),
    ...(query && {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }),
  };

  let videos = await Video.aggregate([
    {
      $match: matchConditions,
    },
    {
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    },
    { $skip: (pageNumber - 1) * limitNumber },
    { $limit: limitNumber },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "owner",
        as: "ownerInfo",
      },
    },
    { $unwind: "$ownerInfo" },
    {
      $project: {
        _id: 1,
        title: 1,
        thumbnail: 1,
        views: 1,
        createdAt: 1,
        ownerInfo: { _id: 1, username: 1, avatar: 1 },
      },
    },
  ]);

  if (!videos || !videos?.length) {
    return res.status(400).json(new ResHandler(400, [], "No video found!"));
  }

  return res
    .status(200)
    .json(new ResHandler(200, videos, "All published videos listed"));
});

const getSubscribedUsersVideos = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  const {
    page = 1,
    limit = 5,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const sortCondition = { [sortBy]: sortType === "desc" ? -1 : 1 };

  const matchConditions = {
    isPublished: true,
    ...(query && {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }),
  };

  let videos = await Subscription.aggregate([
    {
      $match: { subscriber: new mongoose.Types.ObjectId(currentUserID) },
    },
    {
      $lookup: {
        from: "videos",
        let: { channelID: "$channel" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$owner", "$$channelID"] },
              ...matchConditions,
            },
          },
          { $sort: sortCondition },
          { $skip: (pageNumber - 1) * limitNumber },
          { $limit: limitNumber },
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "owner",
              as: "ownerInfo",
            },
          },
          { $unwind: "$ownerInfo" },
          {
            $project: {
              _id: 1,
              thumbnail: 1,
              title: 1,
              views: 1,
              createdAt: 1,
              ownerInfo: { _id: 1, username: 1, avatar: 1 },
            },
          },
        ],
        as: "subscribedUsersVideos",
      },
    },
    {
      $unwind: "$subscribedUsersVideos", // Flatten the array
    },
    {
      $replaceRoot: { newRoot: "$subscribedUsersVideos" }, // Restructure output
    },
  ]);

  if (!videos || videos.length === 0) {
    return res
      .status(400)
      .json(new ResHandler(400, [], "No subscribed users' videos found"));
  }

  return res
    .status(200)
    .json(new ResHandler(200, videos, "Subscribed users' videos found"));
});

const uploadAVideo = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  const { title, description } = req.body;
  // let { videoFile, thumbnail } = req.files;

  if (!(title && description))
    throw new ErrorHandler(400, "missing required fields!");

  let videoFileLocalPath = req?.files?.videoFile[0]?.path;
  if (!videoFileLocalPath) throw new ErrorHandler(400, "video File required!");

  let thumbnailLocalPath = req?.files?.thumbnail[0]?.path;
  if (!thumbnailLocalPath) throw new ErrorHandler(400, "thumbnail required!");

  const videoURL = await uploadOnCloudinary(videoFileLocalPath);
  if (!videoURL)
    throw new ErrorHandler(
      400,
      "something went wrong while uploading video file!"
    );

  const thumbnailURL = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnailURL)
    throw new ErrorHandler(
      400,
      "something went wrong while uploading thumbnail!"
    );

  const video = await Video.create({
    videoFile: videoURL.url,
    thumbnail: thumbnailURL.url,
    title,
    description,
    duration: videoURL.duration,
    owner: currentUserID,
  });

  if (!video) throw new ErrorHandler(400, "Video not created!");

  return res.status(201).json(new ResHandler(201, video, "video uploaded"));
});

const getVideoByID = asyncHandler(async (req, res) => {
  const currentUserID = req.user._id;
  const { videoID } = req.params;

  // Fetch video information
  let temp_video = await Video.findById(videoID);

  if (!(temp_video && temp_video.isPublished))
    throw new ErrorHandler(404, "Video not found or privated!");

  // Increment view count
  temp_video.views++;
  await temp_video.save();

  // Add to user's watch history
  await User.findByIdAndUpdate(currentUserID, {
    $addToSet: { watchHistory: temp_video._id },
  });

  let videos = await Video.aggregate([
    {
      $match: { _id: temp_video._id },
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
      $lookup: {
        from: "likes",
        foreignField: "video",
        localField: "_id",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        foreignField: "video",
        localField: "_id",
        as: "comments",
        pipeline: [
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "owner",
              as: "commentOwner",
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
              owner: { $arrayElemAt: ["$commentOwner", 0] },
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
      $lookup: {
        from: "subscriptions",
        foreignField: "channel",
        localField: "owner._id",
        as: "subscribers",
      },
    },
    {
      $addFields: {
        totalSubscribers: { $size: "$subscribers" },
        totalLikes: { $size: "$likes" },
        totalComments: { $size: "$comments" },
        isLikedByCurrentUser: {
          $in: [currentUserID, "$likes.likedBy"],
        },
        isSubscribedByCurrentUser: {
          $in: [currentUserID, "$subscribers.subscriber"],
        },
        owner: { $arrayElemAt: ["$owner", 0] }, // Ensure consistency with post aggregation
      },
    },
    {
      $project: {
        _id: 1,
        thumbnail: 1,
        videoFile: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,
        owner: 1,
        totalSubscribers: 1,
        isSubscribedByCurrentUser: 1,
        totalLikes: 1,
        isLikedByCurrentUser: 1,
        totalComments: 1,
        comments: 1,
      },
    },
  ]);

  if (!videos || !videos.length)
    throw new ErrorHandler(404, "Video not found!");

  return res.status(200).json(new ResHandler(200, videos[0], "Video found"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoID } = req.params;
  const { title, description, isPublished } = req.body;

  let temp_video = await Video.findById(videoID);
  if (!temp_video) throw new ErrorHandler(404, "Video not found!");

  let updateFields = {};

  if (title) updateFields.title = title;
  if (description) updateFields.description = description;
  if (isPublished !== undefined) updateFields.isPublished = isPublished;

  let thumbnailLocalPath = req.file?.path;
  if (thumbnailLocalPath) {
    const thumbnailURL = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnailURL)
      throw new ErrorHandler(
        400,
        "Something went wrong while uploading thumbnail!"
      );

    updateFields.thumbnail = thumbnailURL.url;

    let isDeleted = await deleteFromCloudinary(temp_video.thumbnail);
    if (!isDeleted)
      throw new ErrorHandler(400, "Something went wrong while deleting file!");
  }

  if (Object.keys(updateFields).length === 0)
    throw new ErrorHandler(400, "all fields are empty which is not allowed!");

  let video = await Video.findByIdAndUpdate(videoID, updateFields, {
    new: true,
  });

  if (!video)
    throw new ErrorHandler(400, "Something went wrong while updating video!");

  return res
    .status(200)
    .json(new ResHandler(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoID } = req.params;

  let temp_video = await Video.findById(videoID);
  if (!temp_video) throw new ErrorHandler(404, "video not found!");

  const deleteOperations = [];

  if (temp_video?.thumbnail) {
    deleteOperations.push(deleteFromCloudinary(temp_video.thumbnail));
  }

  if (temp_video?.videoFile) {
    deleteOperations.push(deleteFromCloudinary(temp_video.videoFile, "video"));
  }

  const deleteResults = await Promise.all(deleteOperations);

  if (deleteResults.includes(false)) {
    throw new ErrorHandler(400, "Something went wrong while deleting files!");
  }

  await Video.findByIdAndDelete(videoID);

  return res.status(200).json(new ResHandler(200, {}, "video deleted"));
});

// -- //

export {
  getAllVideos,
  getSubscribedUsersVideos,
  uploadAVideo,
  getVideoByID,
  updateVideo,
  deleteVideo,
};
