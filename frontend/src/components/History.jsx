import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWatchHistory } from "../redux/actions/dashboard";
import { SimpleGrid, Text, useToast } from "@chakra-ui/react";
import { VideoBox } from "./index";
import { formatDate } from "../constants/";

const History = ({ user }) => {
  let { watchHistory } = useSelector((state) => state.dashboard);
  // console.log("watchHistory:", watchHistory);
  // console.log("user:", user);

  let dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(getWatchHistory(user?._id))
      .then((res) => {
        // console.log("history res:", res);

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
          title: `Error while fetching current user's history: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch]);

  return (
    <SimpleGrid
      columns={{ base: 1, sm: 2, md: 4 }}
      spacing={"6"}
      overflowY={"auto"}
      // bgColor={"skyblue"}
      scrollBehavior={"smooth"}
      style={{ scrollbarWidth: "none" }}
    >
      {watchHistory?.length > 0 ? (
        watchHistory?.map((video) => (
          <VideoBox
            key={video._id}
            videoID={video._id}
            thumbnail={video.thumbnail}
            userAvatar={video.owner.avatar}
            title={video.title}
            userID={video.owner._id}
            username={video.owner.username}
            views={video.views}
            createdAt={formatDate(video.createdAt)}
            isHistory={true}
          />
        ))
      ) : (
        <Text colorScheme="purple">Nothing In History</Text>
      )}
    </SimpleGrid>
  );
};

export default History;
