import { Router } from "express";
import {
  userSignin,
  userSignup,
  userSignout,
  generateRefreshTokenAgain,
  ChangePassword,
  GetUser,
  GetCurrentUser,
  UpdateCurrentUser,
  updateCurrentUserAvatar,
  updateCurrentUserCoverImage,
  getUserChannelProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

// --- //

export const router = Router();

router.route("/signup").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userSignup
);
router.route("/signin").post(userSignin);
router.route("/refreshtoken").post(isAuthenticated, generateRefreshTokenAgain);
router.route("/signout").get(isAuthenticated, userSignout);
router
  .route("/currentuser/me")
  .get(isAuthenticated, GetCurrentUser)
  .patch(isAuthenticated, UpdateCurrentUser);

router.route("/changepassword").patch(isAuthenticated, ChangePassword);
router
  .route("/currentuser/avatar")
  .patch(isAuthenticated, upload.single("avatar"), updateCurrentUserAvatar);
router
  .route("/currentuser/coverimage")
  .patch(
    isAuthenticated,
    upload.single("coverImage"),
    updateCurrentUserCoverImage
  );

router.route("/channel").get(isAuthenticated, getUserChannelProfile);

router.route("/requested-user").get(isAuthenticated, GetUser);
