import { Avatar, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { formatDate } from "../constants/";
import { useSelector } from "react-redux";

const PostBox = ({ postID, userAvatar, userID, userName, createdAt }) => {
  let { user } = useSelector((state) => state.user);
  return (
    <VStack
      h={userAvatar && userName ? "10rem" : ""}
      w={"80%"}
      p={"4"}
      border={"1px solid purple"}
      rounded={"2xl"}
      justifyContent={"space-between"}
    >
      <HStack w={"full"} justifyContent={"space-between"}>
        {userAvatar && userName && (
          <HStack>
            {userAvatar && <Avatar src={userAvatar} />}

            {userName && (
              <Link
                to={userID === user._id ? `/myProfile` : `/profile/${userID}`}
              >
                <Text fontSize={"lg"}>{userName}</Text>
              </Link>
            )}
          </HStack>
        )}
        <Text>{formatDate(createdAt)}</Text>
      </HStack>
      <HStack w={"full"} justifyContent={"flex-start"}>
        <Link to={`/postPage/${postID}`}>
          <Button variant={"link"} colorScheme="purple">
            View Content
          </Button>
        </Link>
      </HStack>
    </VStack>
  );
};

export default PostBox;
