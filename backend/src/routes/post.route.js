import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts,
} from "../controllers/post.controller.js";

// --- //

export const router = Router();

router.use(isAuthenticated);

router.route("/").get(getAllPosts).post(createPost);

router.route("/:postID").get(getPost).patch(updatePost).delete(deletePost);
