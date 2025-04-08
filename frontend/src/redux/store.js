import { configureStore } from "@reduxjs/toolkit";
import { reducer as userReducer } from "./reducres/user";
import { reducer as postReducer } from "./reducres/post";
import { reducer as videoReducer } from "./reducres/video";
import { reducer as commentReducer } from "./reducres/comment";
import { reducer as likeReducer } from "./reducres/like";
import { reducer as subscriptionReducer } from "./reducres/subscription";
import { reducer as dashboardReducer } from "./reducres/dashboard";
import { reducer as playlistReducer } from "./reducres/playlist";

export const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    video: videoReducer,
    comment: commentReducer,
    like: likeReducer,
    subscription: subscriptionReducer,
    dashboard: dashboardReducer,
    playlist: playlistReducer,
    // remaining reducers go here ??
  },
});
