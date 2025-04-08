import { SimpleGrid, Text, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { VideoBox } from "./index";
import { useDispatch, useSelector } from "react-redux";
import { getVideos } from "../redux/actions/dashboard";
import { formatDate } from "../constants/";

const Videos = ({ user }) => {
  let { videos } = useSelector((state) => state.dashboard);
  let { user: currentUser } = useSelector((state) => state.user);
  // console.log("videos:", videos);
  // console.log("user:", user);

  let dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(getVideos(user?._id))
      .then((res) => {
        if (res.payload?.success) {
          return;
        } else {
          toast({
            title: res.payload,
            status: "error",
            duration: 5000,
          });
        }
      })
      .catch((err) =>
        toast({
          title: `Error while fetching user's videos: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch, user?._id]);

  return (
    <SimpleGrid
      columns={{ base: 1, sm: 2, md: 4 }}
      spacing={"6"}
      overflowY={"auto"}
      // bgColor={"skyblue"}
      scrollBehavior={"smooth"}
      style={{ scrollbarWidth: "none" }}
    >
      {videos?.length > 0 ? (
        videos?.map((video) => (
          <VideoBox
            key={video._id}
            isMine={user?._id === currentUser?._id}
            videoID={video._id}
            thumbnail={video.thumbnail}
            // userAvatar={video.ownerInfo[0].avatar}
            title={video.title}
            // userID={video.ownerInfo[0]._id}
            // username={video.ownerInfo[0].username}
            views={video.views}
            createdAt={formatDate(video.createdAt)}
          />
        ))
      ) : (
        <Text colorScheme="purple">No Video Found</Text>
      )}
    </SimpleGrid>
  );
};

export default Videos;
