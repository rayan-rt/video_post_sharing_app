import {
  Button,
  Container,
  HStack,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import PlaylistBox from "./PlaylistBox";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../redux/actions/user";
import { getUserPlaylists } from "../redux/actions/playlist";

const MyPlaylist = () => {
  let { playlists } = useSelector((state) => state.playlist);

  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(getUserPlaylists())
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
          title: `Error while getting playlists: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch]);

  return (
    <Container maxW={"container.xl"} h={"100vh"} py={"14"}>
      <HStack w={"full"} justifyContent={"space-between"}>
        <Text fontSize={"2xl"} fontWeight={"semibold"}>{`Total Playlists ${
          playlists?.length || 0
        }`}</Text>
        <Link to={"/createPlaylistPage"}>
          <Button colorScheme="purple">Create +</Button>
        </Link>
      </HStack>

      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 4 }}
        spacing={"6"}
        overflowY={"auto"}
        // bgColor={"skyblue"}
        scrollBehavior={"smooth"}
        my={8}
        style={{ scrollbarWidth: "none" }}
      >
        {playlists?.length > 0 ? (
          playlists?.map((playlist) => (
            <PlaylistBox
              key={playlist._id}
              createdAt={playlist.createdAt}
              title={playlist.name}
              playlistID={playlist._id}
              videos={playlist.videos?.length}
            />
          ))
        ) : (
          <Text fontSize={"2xl"} fontWeight={"semibold"}>
            No Playlist Found
          </Text>
        )}
      </SimpleGrid>
    </Container>
  );
};

export default MyPlaylist;
