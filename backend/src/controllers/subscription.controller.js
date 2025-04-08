import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { ResHandler } from "../utils/resHandler.js";

// --- //

const toggleSubscription = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  const { channelID } = req.query;

  let channelToSubscribe = await User.findById(channelID);
  if (!channelToSubscribe) throw new ErrorHandler(404, "Channel not found");

  let isSubscribed = await Subscription.findOne({
    subscriber: currentUserID,
    channel: channelToSubscribe._id,
  });

  if (isSubscribed) {
    await Subscription.findByIdAndDelete(isSubscribed._id);

    return res
      .status(200)
      .json(new ResHandler(200, {}, "Subscription deleted, Unsubscribed!"));
  } else {
    let subscription = await Subscription.create({
      subscriber: currentUserID,
      channel: channelToSubscribe._id,
    });

    return res
      .status(201)
      .json(
        new ResHandler(201, subscription, "Subscription created, Subscribed")
      );
  }
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;

  // aggregation pipeline -> "channels" mein "subscriber" bhi aa rahe hein jo k mein hun aur "channel" bhi hein jin ko mein ne subscribe kr rakha he | mujhe channels mein se channel chahiye (scrolling k saath)

  let subscription = await Subscription.aggregate([
    {
      $match: { subscriber: currentUserID },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "channel",
        as: "subscribedChannels",

        pipeline: [
          {
            $project: {
              _id: 1,
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
  ]);

  let subscribed_channels = subscription
    .map((subscriptionObj) => subscriptionObj.subscribedChannels[0])
    .filter((channel) => channel);

  if (subscribed_channels?.length > 0)
    return res
      .status(200)
      .json(new ResHandler(200, subscribed_channels, "your subscription"));
  else
    return res
      .status(200)
      .json(new ResHandler(200, [], "you have no subscription!"));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { subscriberID } = req.query;

  let temp_user = await User.findById(subscriberID);
  if (!temp_user) throw new ErrorHandler(404, "User not found");

  let subscription = await Subscription.aggregate([
    {
      $match: { channel: new mongoose.Types.ObjectId(subscriberID) },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "subscriber",
        as: "subscribers",

        pipeline: [
          {
            $project: {
              _id: 1,
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
  ]);

  let my_subscribers = subscription
    .map((subscriptionObj) => subscriptionObj.subscribers[0])
    .filter((subscriber) => subscriber);

  if (my_subscribers.length > 0) {
    return res
      .status(200)
      .json(new ResHandler(200, my_subscribers, "your subscribers list"));
  } else {
    return res
      .status(200)
      .json(new ResHandler(200, [], "you have no subscriber!"));
  }
});

const isChannelSubscribed = asyncHandler(async (req, res) => {
  let currentUserID = req.user._id;
  const { channelID } = req.query;

  let temp_user = await User.findById(channelID);
  if (!temp_user) throw new ErrorHandler(404, "Channel not found");

  let isSubscribed = await Subscription.findOne({
    subscriber: currentUserID,
    channel: channelID,
  });

  let resData = isSubscribed ? { isSubscribed: true } : { isSubscribed: false };
  let resMessage = isSubscribed ? "Subscribed" : "Not Subscribed";

  return res.status(200).json(new ResHandler(200, resData, resMessage));
});

export {
  toggleSubscription,
  getSubscribedChannels,
  getUserChannelSubscribers,
  isChannelSubscribed,
};
