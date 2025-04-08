import { Container, HStack, useToast } from "@chakra-ui/react";
import { Loader, PlaylistSidePanel, PlaylistVideos, VideoBox } from "./index";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getLikedVideos } from "../redux/actions/like.js";

// -- //

const GetAllLikedVideosPage = () => {
  let { isLoading: likeLoading, likes } = useSelector((state) => state.like);
  // console.log("likes: ", likes);

  let dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(getLikedVideos())
      .then((res) => {
        // console.log("like:", res);

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
          title: `Error while getting liked videos: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch]);

  if (likeLoading) return <Loader />;

  return (
    <Container maxW={"container.xl"} h={"100vh"} py={"14"} px={"10"}>
      <HStack w={"full"} h={"full"}>
        <PlaylistSidePanel data={likes} />
        <PlaylistVideos data={likes} />
      </HStack>
    </Container>
  );
};

export default GetAllLikedVideosPage;
