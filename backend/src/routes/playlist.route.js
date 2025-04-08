import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  getPlaylistByID,
  updatePlaylist,
  deletePlaylist,
  getUserPlaylists,
  addOrRemoveVideoToPlaylist,
} from "../controllers/playlist.controller.js";

// --- //

export const router = Router();

router.use(isAuthenticated);

router.route("/").post(createPlaylist).get(getUserPlaylists);
router.route("/add_remove").patch(addOrRemoveVideoToPlaylist);

router
  .route("/:playlistID")
  .get(getPlaylistByID)
  .patch(updatePlaylist)
  .delete(deletePlaylist);
