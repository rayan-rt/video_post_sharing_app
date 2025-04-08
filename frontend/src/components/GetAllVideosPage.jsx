import { Container, Input, SimpleGrid, Text, useToast } from "@chakra-ui/react";
import { Loader, PaginationButton, SearchBar, VideoBox } from "./index";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../constants/";
import { useEffect, useState } from "react";
import { getAllVideos } from "../redux/actions/video.js";

// -- //

const GetAllVideosPage = () => {
  let { isLoading, videos } = useSelector((state) => state.video);
  //   console.log("videos: ", videos);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  let dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(
      getAllVideos({
        userID: "",
        query: "",
        page,
        limit,
      })
    )
      .then((res) => {
        // console.log("videos:", res);

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
          title: `Error while getting all videos: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch, page, limit]);

  if (isLoading) return <Loader />;

  return (
    <Container maxW={"container.xl"} h={"100vh"} p={"10"}>
      <SearchBar />

      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 4 }}
        spacing={"6"}
        overflowY={"auto"}
        // bgColor={"skyblue"}
        scrollBehavior={"smooth"}
        mt={8}
        style={{ scrollbarWidth: "none" }}
      >
        {videos?.length > 0 ? (
          videos?.map((video) => (
            <VideoBox
              key={video._id}
              videoID={video._id}
              thumbnail={video.thumbnail}
              userAvatar={video.ownerInfo?.avatar}
              title={video.title}
              userID={video.ownerInfo?._id}
              username={video.ownerInfo?.username}
              views={video.views}
              createdAt={formatDate(video.createdAt)}
            />
          ))
        ) : (
          <Text fontSize={"2xl"} fontWeight={"semibold"}>
            No video found
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

export default GetAllVideosPage;
