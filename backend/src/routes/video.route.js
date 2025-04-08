import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getAllVideos,
  uploadAVideo,
  getVideoByID,
  updateVideo,
  deleteVideo,
  getSubscribedUsersVideos,
} from "../controllers/video.controller.js";

// --- //

export const router = Router();

router.use(isAuthenticated);

router
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    uploadAVideo
  );
router.route("/subscribedUsersVideos").get(getSubscribedUsersVideos);

router
  .route("/:videoID")
  .get(getVideoByID)
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo);
