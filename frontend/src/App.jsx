import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./redux/actions/user";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import {
  ChangeAvatarPage,
  ChangeCoverImagePage,
  ChangePasswordPage,
  CreatePostPage,
  Error,
  GetAllPostsPage,
  GetAllVideosPage,
  GetAllLikedVideosPage,
  Home,
  Loader,
  PostPage,
  Profile,
  Signin,
  Signup,
  UpdateForm,
  UpdatePostPage,
  UploadVideoPage,
  VideoPage,
  GetAllLikedPostsPage,
  Subscription,
  UpdateVideoPage,
  MyPlaylist,
  CreatePlaylistPage,
  PlaylistPage,
  UpdatePlaylistPage,
  AddToPlaylistPage,
  Navbar,
  MyProfile,
} from "./components";

function App() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="*" element={<div>Page Not Found!</div>} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={isAuthenticated ? <Home /> : <Signin />} />
        <Route
          path="/myprofile"
          element={isAuthenticated ? <MyProfile /> : <Signin />}
        />
        <Route
          path="/profile/:userID"
          element={isAuthenticated ? <Profile /> : <Signin />}
        />
        <Route
          path="/updateProfilePage"
          element={isAuthenticated ? <UpdateForm /> : <Signin />}
        />
        <Route
          path="/changePasswordPage"
          element={isAuthenticated ? <ChangePasswordPage /> : <Signin />}
        />
        <Route
          path="/changeAvatarPage"
          element={isAuthenticated ? <ChangeAvatarPage /> : <Signin />}
        />
        <Route
          path="/changeCoverImagePage"
          element={isAuthenticated ? <ChangeCoverImagePage /> : <Signin />}
        />

        {/*  */}

        <Route
          path="/createPostPage"
          element={isAuthenticated ? <CreatePostPage /> : <Signin />}
        />
        <Route
          path="/posts"
          element={isAuthenticated ? <GetAllPostsPage /> : <Signin />}
        />
        <Route
          path="/liked_posts"
          element={isAuthenticated ? <GetAllLikedPostsPage /> : <Signin />}
        />
        <Route
          path="/postPage/:postID"
          element={isAuthenticated ? <PostPage /> : <Signin />}
        />
        <Route
          path="/updatePostPage/:postID"
          element={isAuthenticated ? <UpdatePostPage /> : <Signin />}
        />

        {/*  */}

        <Route
          path="/uploadVideoPage"
          element={isAuthenticated ? <UploadVideoPage /> : <Signin />}
        />
        <Route
          path="/videos"
          element={isAuthenticated ? <GetAllVideosPage /> : <Signin />}
        />
        <Route
          path="/liked_videos"
          element={isAuthenticated ? <GetAllLikedVideosPage /> : <Signin />}
        />
        <Route
          path="/videoPage/:videoID"
          element={isAuthenticated ? <VideoPage /> : <Signin />}
        />
        <Route
          path="/updateVideoPage/:videoID"
          element={isAuthenticated ? <UpdateVideoPage /> : <Signin />}
        />

        {/*  */}

        <Route
          path="/my_playlists"
          element={isAuthenticated ? <MyPlaylist /> : <Signin />}
        />
        <Route
          path="/createPlaylistPage"
          element={isAuthenticated ? <CreatePlaylistPage /> : <Signin />}
        />
        <Route
          path="/updatePlaylistPage/:playlistID"
          element={isAuthenticated ? <UpdatePlaylistPage /> : <Signin />}
        />
        <Route
          path="/playlistPage/:playlistID"
          element={isAuthenticated ? <PlaylistPage /> : <Signin />}
        />
        <Route
          path="/addToPlaylistPage/:videoID"
          element={isAuthenticated ? <AddToPlaylistPage /> : <Signin />}
        />

        {/*  */}

        <Route
          path="/subscription"
          element={isAuthenticated ? <Subscription /> : <Signin />}
        />
      </Routes>
    </Router>
  );
}

export default App;
