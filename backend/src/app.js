import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// --- //

const app = express();

// configurations
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// routes importion
import { router as userRoute } from "./routes/user.route.js";
import { router as videoRoute } from "./routes/video.route.js";
import { router as commentRoute } from "./routes/comment.route.js";
import { router as likeRoute } from "./routes/like.route.js";
import { router as playlistRoute } from "./routes/playlist.route.js";
import { router as postRoute } from "./routes/post.route.js";
import { router as subscriptionRoute } from "./routes/subscription.route.js";
import { router as dashboardRoute } from "./routes/dashboard.route.js";

// routes declaration
app.use("/api/v1/user", userRoute);
app.use("/api/v1/video", videoRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/like", likeRoute);
app.use("/api/v1/playlist", playlistRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/subscription", subscriptionRoute);
app.use("/api/v1/dashboard", dashboardRoute);

export { app };
