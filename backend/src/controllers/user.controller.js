import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { ResHandler } from "../utils/resHandler.js";
import { User } from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

// --- //

const userSignup = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  )
    throw new ErrorHandler(400, "missing required fields!");

  let isExistent = await User.findOne({ $or: [{ email }, { username }] });
  if (isExistent)
    throw new ErrorHandler(400, "username or email already exists!");

  let avatarLocalPath = req?.files?.avatar[0]?.path;
  if (!avatarLocalPath) throw new ErrorHandler(400, "profile image required!");

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  )
    coverImageLocalPath = req.files.coverImage[0].path;

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar)
    throw new ErrorHandler(400, "something went wrong while uploading file!");

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser)
    throw new ErrorHandler(500, "something went wrong while registering!");

  let accessJWT = user.generateAccessJWT();
  let refreshToken = user.generateRefreshToken();

  createdUser.refreshToken = refreshToken;
  await createdUser.save({ validateBeforeSave: false });

  let cookieOptions = { httpOnly: true, secure: true };

  res
    .cookie("accessJWT", accessJWT, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions);

  return res
    .status(201)
    .json(new ResHandler(201, createdUser, "User Signed up and signed in"));
});

const userSignin = asyncHandler(async (req, res) => {
  let { username, email, password } = req.body;

  if (!(username || email || password))
    return res
      .status(400)
      .json(new ErrorHandler(400, "missing required fields!"));

  let user = await User.findOne({ $or: [{ username }, { email }] });

  let isCorrect = await user?.isPasswordCorrect(password);
  if (!isCorrect) throw new ErrorHandler(401, "invalid credentials!");

  let accessJWT = user.generateAccessJWT();
  let refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  let cookieOptions = { httpOnly: true, secure: true };

  res
    .cookie("accessJWT", accessJWT, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions);

  return res.status(200).json(new ResHandler(200, user, "user signed in"));
});

const userSignout = asyncHandler(async function (req, res) {
  let currentUserID = req.user._id;

  await User.findByIdAndUpdate(
    currentUserID,
    { $set: { refreshToken: undefined } },
    { new: true }
  );
  res.clearCookie("accessJWT").clearCookie("refreshToken");

  return res.status(200).json(new ResHandler(200, {}, "user signed out"));
});

const GetCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ResHandler(200, req.user, "User found"));
});

const GetUser = asyncHandler(async (req, res) => {
  let { userID } = req.query;

  let user = await User.findById(userID).select(
    "-password -refreshToken -watchHistory"
  );
  if (!user) throw new ErrorHandler(404, "User not found!");

  return res.status(200).json(new ResHandler(200, user, "User found"));
});

const generateRefreshTokenAgain = asyncHandler(async (req, res) => {
  let incomigRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  if (!incomigRefreshToken)
    throw new ErrorHandler(401, "Unauthorized request!");

  try {
    let decodedData = jsonwebtoken.verify(
      incomigRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    let user = await User.findById(decodedData?._id);
    if (!user) throw new ErrorHandler(401, "Unauthorized request!");

    if (incomigRefreshToken !== user.refreshToken)
      throw new ErrorHandler(401, "Unauthorized request!");

    let accessJWT = user.generateAccessJWT();
    let refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    let cookieOptions = { httpOnly: true, secure: true };

    res
      .cookie("accessJWT", accessJWT, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json(new ResHandler(200, user, "Token refreshed"));
  } catch (error) {
    throw new ErrorHandler(401, error.message || "Unauthorized request!");
  }
});

const ChangePassword = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  let { oldPassword, newPassword, confirmNewPassword } = req.body;

  let user = await User.findById(currentUserID);
  let isCorrect = await user?.isPasswordCorrect(oldPassword);
  if (!isCorrect) throw new ErrorHandler(401, "invalid credentials!");

  if (newPassword !== confirmNewPassword)
    throw new ErrorHandler(401, "invalid credentials!");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ResHandler(200, user, "Password changed"));
});

const UpdateCurrentUser = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  const { fullName, email, username } = req.body;

  let user = await User.findById(currentUserID);

  if (!(fullName || email || username)) {
    return res
      .status(200)
      .json(new ResHandler(200, user, "nothing to update!"));
  }

  let updatedFields = {};
  if (fullName) updatedFields.fullName = fullName;
  if (email) updatedFields.email = email;
  if (username) updatedFields.username = username.toLowerCase();

  user = await User.findByIdAndUpdate(currentUserID, updatedFields, {
    new: true,
  }).select("-password");

  if (!user) throw new ErrorHandler(404, "User not found!");

  return res.status(200).json(new ResHandler(200, user, "User updated"));
});

const updateCurrentUserAvatar = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;

  let avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new ErrorHandler(404, "avatar not found!");

  let avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar)
    throw new ErrorHandler(400, "something went wrong while uploading file!");

  let temp_user = await User.findById(currentUserID);
  if (temp_user?.avatar) {
    let isDeleted = await deleteFromCloudinary(temp_user.avatar);
    if (!isDeleted)
      throw new ErrorHandler(500, "something went wrong while deleting file!");
  }

  let user = await User.findByIdAndUpdate(
    currentUserID,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password");
  if (!user)
    throw new ErrorHandler(
      404,
      "Something went wrong while updating user avatar!"
    );

  return res.status(200).json(new ResHandler(200, user, "User avatar updated"));
});

const updateCurrentUserCoverImage = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;

  let coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath)
    throw new ErrorHandler(404, "cover image not found!");

  let coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage)
    throw new ErrorHandler(400, "something went wrong while uploading file!");

  let temp_user = await User.findById(currentUserID);
  if (temp_user?.coverImage) {
    let isDeleted = await deleteFromCloudinary(temp_user.coverImage);
    if (!isDeleted)
      throw new ErrorHandler(500, "something went wrong while deleting file!");
  }

  let user = await User.findByIdAndUpdate(
    currentUserID,
    { $set: { coverImage: coverImage.url } },
    { new: true }
  ).select("-password");
  if (!user)
    throw new ErrorHandler(
      404,
      "something went wrong while updating user cover image!"
    );

  return res
    .status(200)
    .json(new ResHandler(200, user, "User cover image updated"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  let { username } = req.query;

  let user = await User.findOne({ username });
  if (!user) throw new ErrorHandler(404, "User not found!");

  let channel = await User.aggregate([
    {
      $match: { username },
    },
    {
      $lookup: {
        from: "subscriptions",
        foreignField: "channel",
        localField: "_id",
        as: "subscribers",
      },
    },
    { $unwind: "$subscribers" },
    {
      $lookup: {
        from: "subscriptions",
        foreignField: "subscriber",
        localField: "_id",
        as: "subscribedToChannels",
      },
    },
    { $unwind: "$subscribedToChannels" },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" }, // already he
        subscribedToChannelsCount: { $size: "$subscribedToChannels" },
        isSubscribed: {
          $cond: {
            if: { $in: [currentUserID, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        email: 1,
        fullName: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        subscribedToChannelsCount: 1,
        isSubscribed: 1,
      },
    },
  ]);

  // console.log("channel:", channel);

  if (!channel?.length) throw new ErrorHandler(404, "Channel not found!");

  return res
    .status(200)
    .json(new ResHandler(200, channel[0], "User Channel found"));
});

// -- //

export {
  userSignup,
  userSignin,
  userSignout,
  GetCurrentUser,
  GetUser,
  generateRefreshTokenAgain,
  ChangePassword,
  UpdateCurrentUser,
  updateCurrentUserAvatar,
  updateCurrentUserCoverImage,
  getUserChannelProfile,
};
