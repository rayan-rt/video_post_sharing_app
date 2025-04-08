import { Container, SimpleGrid, Text, useToast } from "@chakra-ui/react";
import { Loader, PaginationButton, SearchBar, VideoBox } from "./index";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getSubscribedUsersVideos } from "../redux/actions/video.js";
import { formatDate } from "../constants/";

const Home = () => {
  const { isLoading: videoLoading, videos } = useSelector(
    (state) => state.video
  );
  console.log("videoData:", videos);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(getSubscribedUsersVideos({ query: "", page, limit }))
      .then((res) => {
        // console.log("posts:", res);

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
          title: `Error while getting subscribed users videos: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch, page, limit]);

  if (videoLoading) return <Loader />;

  return (
    <Container maxW={"container.xl"} h={"100vh"} p={"10"}>
      <SearchBar isAll={false} />

      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 4 }}
        spacing={"6"}
        overflowY={"auto"}
        scrollBehavior={"smooth"}
        style={{ scrollbarWidth: "none", marginTop: "1rem" }}
      >
        {videos?.length > 0 ? (
          videos?.map((video) => (
            <VideoBox
              key={video._id}
              videoID={video._id}
              thumbnail={video.thumbnail}
              userAvatar={video.ownerInfo.avatar}
              title={video.title}
              userID={video.ownerInfo._id}
              username={video.ownerInfo.username}
              views={video.views}
              createdAt={formatDate(video.createdAt)}
            />
          ))
        ) : (
          <Text w={"100vw"} pt={4} fontSize={"2xl"} fontWeight={"semibold"}>
            No video found or You don't have any Subscription
          </Text>
        )}
      </SimpleGrid>

      {videos?.length > 0 && (
        <PaginationButton
          currentPage={page}
          itemsLength={videos?.length}
          limit={limit}
          onPageChange={setPage}
        />
      )}
    </Container>
  );
};

export default Home;
