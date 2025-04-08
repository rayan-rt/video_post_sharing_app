import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { ResHandler } from "../utils/resHandler.js";

// --- //

const createPlaylist = asyncHandler(async (req, res) => {
  const currentUserID = req.user._id;
  const { name, description } = req.body;

  let playlist = await Playlist.create({
    name,
    description,
    owner: currentUserID,
  });

  if (!playlist) throw new ErrorHandler(500, "Failed to create playlist!");

  return res
    .status(201)
    .json(new ResHandler(201, playlist, "playlist created"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const currentUserID = req.user._id;

  let playlists = await Playlist.find({ owner: currentUserID });

  if (playlists?.length === 0) throw new ErrorHandler(404, "No playlist found");

  return res.status(200).json(new ResHandler(200, playlists, "user playlists"));
});

const getPlaylistByID = asyncHandler(async (req, res) => {
  const { playlistID } = req.params;

  let playlists = await Playlist.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(playlistID) } },

    // Lookup owner info
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },

    // Lookup videos in the playlist
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
      },
    },

    // Lookup video owners
    {
      $lookup: {
        from: "users",
        localField: "videos.owner",
        foreignField: "_id",
        as: "videoOwners",
      },
    },

    // Add computed fields
    {
      $addFields: {
        totalViews: { $sum: "$videos.views" },
        totalVideos: { $size: "$videos" },
        videos: {
          $map: {
            input: "$videos",
            as: "video",
            in: {
              _id: "$$video._id",
              title: "$$video.title",
              views: "$$video.views",
              thumbnail: "$$video.thumbnail",
              createdAt: "$$video.createdAt",
              owner: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$videoOwners",
                      as: "owner",
                      cond: { $eq: ["$$owner._id", "$$video.owner"] },
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
      },
    },

    // Project required fields
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        totalViews: 1,
        totalVideos: 1,
        "owner._id": 1,
        "owner.username": 1,
        "owner.avatar": 1,
        "videos._id": 1,
        "videos.title": 1,
        "videos.views": 1,
        "videos.thumbnail": 1,
        "videos.createdAt": 1,
        "videos.owner._id": 1,
        "videos.owner.username": 1,
      },
    },
  ]);

  if (!playlists.length) throw new ErrorHandler(404, "Playlist not found!");

  res.status(200).json(new ResHandler(200, playlists[0], "Playlist found"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistID } = req.params;
  const { name, description } = req.body;

  let playlist = await Playlist.findById(playlistID);
  if (!playlist) throw new ErrorHandler(404, "Playlist not found");

  if (!(name || description))
    return res
      .status(200)
      .json(new ResHandler(200, playlist, "nothing to update"));

  let updatedFields = {};
  if (name) updatedFields.name = name;
  if (description) updatedFields.description = description;

  playlist = await Playlist.findByIdAndUpdate(playlistID, updatedFields, {
    new: true,
  });

  if (!playlist) throw new ErrorHandler(500, "Failed to update playlist!");

  return res
    .status(200)
    .json(new ResHandler(200, playlist, "playlist updated"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistID } = req.params;

  await Playlist.findByIdAndDelete(playlistID);

  return res.status(200).json(new ResHandler(200, {}, "playlist deleted"));
});

const addOrRemoveVideoToPlaylist = asyncHandler(async (req, res) => {
  const { videoID, playlistID } = req.query;

  let video = await Video.findById(videoID);
  let playlist = await Playlist.findById(playlistID);
  if (!(video && playlist))
    throw new ErrorHandler(404, "Video or Playlist not found");

  if (playlist.videos.includes(video._id)) {
    playlist.videos.pull(video._id);
    await playlist.save();

    return res
      .status(200)
      .json(new ResHandler(200, playlist, "video removed from playlist"));
  } else {
    playlist.videos.push(video._id);
    await playlist.save();

    return res
      .status(200)
      .json(new ResHandler(200, playlist, "video added to playlist"));
  }
});

export {
  createPlaylist,
  getPlaylistByID,
  updatePlaylist,
  deletePlaylist,
  addOrRemoveVideoToPlaylist,
  getUserPlaylists,
};
