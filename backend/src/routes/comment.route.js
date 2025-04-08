import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  getVideoComments,
  updateComment,
  deleteComment,
  addCommentOnVideo,
  getPostComments,
  addCommentOnPost,
} from "../controllers/comment.controller.js";

// --- //

export const router = Router();

router.use(isAuthenticated);

router.route("/video").get(getVideoComments).post(addCommentOnVideo);

router.route("/post").get(getPostComments).post(addCommentOnPost);

router.route("/:commentID").patch(updateComment).delete(deleteComment);
