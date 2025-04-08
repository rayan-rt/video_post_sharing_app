import { Button, VStack, Text, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrRemoveVideoFromPlaylist,
  getUserPlaylists,
} from "../redux/actions/playlist";
import { Link, useNavigate, useParams } from "react-router-dom";

const AddToPlaylistPage = () => {
  const { videoID } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { playlists } = useSelector((state) => state.playlist);

  useEffect(() => {
    dispatch(getUserPlaylists());
  }, [dispatch]);

  function addToPlaylist(playlistID) {
    dispatch(addOrRemoveVideoFromPlaylist({ videoID, playlistID }))
      .then((res) => {
        // console.log("playlist:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 1000,
          });

          navigate(`/videoPage/${videoID}`);
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
          title: `Error while adding/removing video from playlist: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  return (
    <VStack
      alignItems="center"
      justifyContent={"center"}
      gap={4}
      w={"100vw"}
      h={"100vh"}
    >
      <Text mb={8} fontSize={"3xl"} fontWeight={"bold"} color="purple.200">
        In which Playlist You Want to Add?
      </Text>
      {playlists?.length > 0 ? (
        playlists.map((playlistItem) => (
          <Button
            onClick={() => addToPlaylist(playlistItem._id)}
            key={playlistItem._id}
            variant="outline"
            colorScheme="purple"
            w={"fit-content"}
          >
            {playlistItem.name}
          </Button>
        ))
      ) : (
        <Link to="/createPlaylistPage">
          <Button variant="ghost" colorScheme="purple" w={"fit-content"}>
            Create One
          </Button>
        </Link>
      )}
    </VStack>
  );
};

export default AddToPlaylistPage;
