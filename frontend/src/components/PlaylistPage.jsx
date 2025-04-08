import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPlaylistByID } from "../redux/actions/playlist";
import { PlaylistSidePanel, PlaylistVideos } from "./index";
import { Container, Stack, useToast } from "@chakra-ui/react";

const PlaylistPage = () => {
  let { playlistID } = useParams();
  //   console.log("playlistID:", playlistID);

  let { playlist } = useSelector((state) => state.playlist);
  // console.log("playlist:", playlist);

  let dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(getPlaylistByID(playlistID))
      .then((res) => {
        // console.log("playlist:", res);

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
          title: `Error while getting playlist: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch]);

  return (
    <Container maxW={"container.xl"} h={"100vh"} py={"14"} px={"10"}>
      <Stack direction={["column", "row"]} w={"full"} h={"full"}>
        <PlaylistSidePanel data={playlist} isPlaylist={true} />

        <PlaylistVideos data={playlist} isPlaylist={true} />
      </Stack>
    </Container>
  );
};

export default PlaylistPage;
