import {
  Avatar,
  Box,
  Button,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../constants/";
import { FaRegCirclePlay } from "react-icons/fa6";

const PlaylistBox = ({ playlistID, title, videos, createdAt }) => {
  return (
    <VStack
      border={"1px solid white"}
      rounded={"2xl"}
      w={"full"}
      p={"2"}
      alignItems={"flex-start"}
    >
      <Box
        as={Link}
        to={`/playlistPage/${playlistID}`}
        w={"full"}
        h={"10vh"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <FaRegCirclePlay size={"2em"} />
      </Box>

      <Text>{title}</Text>

      <HStack w={"full"} justifyContent={"space-between"}>
        <Text>{`${videos} ${videos > 1 ? "videos" : "video"}`}</Text>
        <Text fontSize={"sm"}>{formatDate(createdAt)}</Text>
      </HStack>
    </VStack>
  );
};

export default PlaylistBox;
