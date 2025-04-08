import {
  Avatar,
  Box,
  Button,
  HStack,
  Image,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatDate } from "../constants/";
import { deleteSingleVideo } from "../redux/actions/video";
import { removeFromHistory } from "../redux/actions/dashboard";

const VideoBox = ({
  videoID,
  thumbnail,
  userAvatar = "",
  title,
  userID = "",
  username = "",
  views,
  createdAt,
  isMine = false,
  isHistory = false,
}) => {
  let { user } = useSelector((state) => state.user);

  let dispatch = useDispatch();
  const toast = useToast();

  function handleRemoveFromHistory() {
    dispatch(removeFromHistory(videoID))
      .then((res) => {
        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 1000,
          });
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
          title: `Error while removing from watch history: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  function handleVideoDelete() {
    dispatch(deleteSingleVideo(videoID))
      .then((res) => {
        // console.log("post:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 1000,
          });
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
          title: `Error while deleting video: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  return (
    <VStack border={"1px solid white"} rounded={"2xl"} w={"full"} p={"2"}>
      <Box as={Link} to={`/videoPage/${videoID}`} width={"full"}>
        <Image
          src={thumbnail}
          alt="thumbnail"
          rounded={"md"}
          width={"full"}
          h={"20vh"}
          objectFit={"cover"}
          objectPosition={"center"}
        />
      </Box>
      <HStack alignItems={"flex-start"} w={"full"}>
        {userAvatar && <Avatar src={userAvatar} size={"sm"} />}

        <VStack alignItems={"flex-start"} gap={"-4"}>
          <Text>{title}</Text>
          {username && userID && (
            <Link
              to={userID === user?._id ? `/myProfile` : `/profile/${userID}`}
            >
              <Text color={"gray"}>{username}</Text>
            </Link>
          )}
        </VStack>
      </HStack>
      <HStack w={"full"} justifyContent={"space-between"}>
        <Text>{`${views} ${views > 1 ? "views" : "view"}`}</Text>
        <Text fontSize={"sm"}>{formatDate(createdAt)}</Text>
      </HStack>

      {isMine && (
        <HStack p={2}>
          <Link to={`/updateVideoPage/${videoID}`}>
            <Button variant={"solid"} colorScheme="purple" size={"sm"}>
              Update
            </Button>
          </Link>
          <Button
            onClick={handleVideoDelete}
            variant={"solid"}
            colorScheme="red"
            size={"sm"}
          >
            Delete
          </Button>
        </HStack>
      )}

      {isHistory && (
        <Button
          onClick={handleRemoveFromHistory}
          variant={"solid"}
          colorScheme="red"
          size={"sm"}
        >
          Remove
        </Button>
      )}
    </VStack>
  );
};

export default VideoBox;
