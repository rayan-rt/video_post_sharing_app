import { Box, Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { formatDate } from "../constants/";
import { addOrRemoveVideoFromPlaylist } from "../redux/actions/playlist";
import { useDispatch } from "react-redux";
import { LuEye } from "react-icons/lu";

const PlaylistVideos = ({ data, isPlaylist = false }) => {
  let dispatch = useDispatch();

  if (data?.videos?.length === 0) {
    return <Text fontSize={"2xl"}>No video found</Text>;
  }

  return (
    <VStack flex={2} h={"full"} p={2} border={"1px solid white"} rounded={"lg"}>
      <VStack
        w={"full"}
        h={"full"}
        p={2}
        gap={8}
        scrollBehavior={"smooth"}
        overflowY={"auto"}
        style={{ scrollbarWidth: "none" }}
      >
        <HStack w={"full"}>
          <Button colorScheme="purple" size={"sm"}>
            Sort
          </Button>
        </HStack>

        <VStack w={"full"} h={"full"} gap={8}>
          {/* loop -> separate component */}
          {data?.videos?.length > 0 ? (
            data?.videos?.map((item) => (
              <HStack key={item?._id} w={"full"}>
                <Box
                  as={Link}
                  to={`/videoPage/${isPlaylist ? item?._id : item?.video?._id}`}
                  w={"15vw"}
                  h={"10vh"}
                >
                  <Image
                    src={isPlaylist ? item?.thumbnail : item?.video?.thumbnail}
                    alt={isPlaylist ? item?.title : item?.video?.title}
                    w={"15vw"}
                    h={"10vh"}
                    objectFit={"cover"}
                    rounded={"lg"}
                  />
                </Box>

                <VStack alignItems={"flex-start"} justifyContent={"flex-start"}>
                  <Text fontWeight={"semibold"}>
                    {isPlaylist ? item?.title : item?.video?.title}
                  </Text>

                  <HStack w={"full"} gap={4}>
                    <Link
                      to={`/profile/${
                        isPlaylist ? item?.owner?._id : item?.videoOwner?._id
                      }`}
                    >
                      <Text fontSize={"sm"}>
                        {isPlaylist
                          ? item?.owner?.username
                          : item?.videoOwner?.username}
                      </Text>
                    </Link>
                    <Text
                      fontSize={"sm"}
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                    >
                      <LuEye />
                      <span>
                        {isPlaylist ? item?.views : item?.video?.views}
                      </span>
                    </Text>
                    <Text fontSize={"sm"}>
                      {formatDate(
                        isPlaylist ? item?.createdAt : item?.video?.createdAt
                      )}
                    </Text>
                    {isPlaylist && (
                      <Button
                        onClick={() =>
                          dispatch(
                            addOrRemoveVideoFromPlaylist({
                              videoID: item?._id,
                              playlistID: data?._id,
                            })
                          )
                        }
                        variant={"ghost"}
                        colorScheme="red"
                      >
                        <RiDeleteBin6Line />
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </HStack>
            ))
          ) : (
            <Text fontSize={"2xl"}>No video found</Text>
          )}
        </VStack>
      </VStack>
    </VStack>
  );
};

export default PlaylistVideos;
