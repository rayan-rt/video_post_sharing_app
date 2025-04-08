import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
  isChannelSubscribed,
} from "../controllers/subscription.controller.js";

// --- //

export const router = Router();

router.use(isAuthenticated);

router.route("/subscribed_channels").get(getSubscribedChannels);

// router.route("/subscribers").get(getUserChannelSubscribers);

router.route("/channel").get(isChannelSubscribed).post(toggleSubscription);

router.route("/user").get(getUserChannelSubscribers);
