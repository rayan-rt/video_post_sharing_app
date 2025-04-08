import {
  Button,
  HStack,
  Image,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { MdOutlineOndemandVideo, MdOutlineRemoveRedEye } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deletePlaylist } from "../redux/actions/playlist";

const PlaylistSidePanel = ({ data, isPlaylist = false }) => {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const toast = useToast();

  function handlePlaylistDelete() {
    dispatch(deletePlaylist(data?._id))
      .then((res) => {
        // console.log("post:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 1000,
          });

          navigate("/my_playlists");
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
          title: `Error while deleting playlist: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  return (
    <VStack flex={1} h={"full"} p={2} border={"1px solid white"} rounded={"lg"}>
      <VStack w={"full"} h={"full"} p={2} gap={4} pos={"relative"}>
        {data?.videos?.length > 0 && (
          <Image
            src={
              isPlaylist
                ? data?.videos[0]?.thumbnail
                : data?.videos[0]?.video?.thumbnail
            }
            alt={"1st video thumbnail"}
            objectFit={"cover"}
            h={"25vh"}
            w={"full"}
            rounded={"lg"}
          />
        )}

        {isPlaylist && (
          <VStack w={"full"} alignItems={"flex-start"}>
            <Text fontSize={"lg"}>{data?.name}</Text>
            <Text fontSize={"sm"}>{data?.description}</Text>
          </VStack>
        )}

        <HStack w={"full"}>
          <Text fontSize={"2xl"}>Total</Text>
          <MdOutlineOndemandVideo />
          <Text>{isPlaylist ? data?.totalVideos : data?.totalLikedVideos}</Text>
          <MdOutlineRemoveRedEye />
          <Text>{data?.totalViews}</Text>
        </HStack>

        {isPlaylist && (
          <HStack
            pos={"absolute"}
            bottom={"10"}
            left={"0"}
            w={"full"}
            justifyContent={"space-evenly"}
          >
            <Button
              onClick={() => navigate(`/updatePlaylistPage/${data?._id}`)}
              colorScheme="purple"
            >
              Update
            </Button>
            <Button onClick={handlePlaylistDelete} colorScheme="red">
              Delete
            </Button>
          </HStack>
        )}
      </VStack>
    </VStack>
  );
};

export default PlaylistSidePanel;
