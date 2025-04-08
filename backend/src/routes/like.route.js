import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  toggleCommentLike,
  togglePostLike,
  toggleVideoLike,
  getLikedVideos,
  getLikedPosts,
  getLikedComments,
  // getVideoLikes,
  // getCommentLikes,
  // getPostLikes,
  // isPostLiked,
  // isVideoLiked,
} from "../controllers/like.controller.js";

// --- //

export const router = Router();

router.use(isAuthenticated);

router.route("/videos").get(getLikedVideos);
router.route("/posts").get(getLikedPosts);
router.route("/comments").get(getLikedComments);

router.route("/toggle/video").post(toggleVideoLike);
router.route("/toggle/post").post(togglePostLike);
router.route("/toggle/comment").post(toggleCommentLike);

/*

router.route("/isvideoliked").get(isVideoLiked);
router.route("/ispostliked").get(isPostLiked);

router.route("/video/:videoID").get(getVideoLikes);
router.route("/post/:postID").get(getPostLikes);
router.route("/comment").get(getCommentLikes);

*/
