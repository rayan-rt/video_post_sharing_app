import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  deleteFromHistory,
  getChannelPosts,
  getChannelStats,
  getChannelVideos,
  getWatchHistory,
} from "../controllers/dashboard.controller.js";

// --- //

export const router = Router();

router.use(isAuthenticated);

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);
router.route("/posts").get(getChannelPosts);

router
  .route("/history")
  .get(isAuthenticated, getWatchHistory)
  .delete(isAuthenticated, deleteFromHistory);
