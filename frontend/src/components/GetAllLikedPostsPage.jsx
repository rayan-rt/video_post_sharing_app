import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "./index";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  HStack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { formatDate } from "../constants/";
import { getLikedPosts } from "../redux/actions/like";

const GetAllLikedPostsPage = () => {
  let { isLoading: likeLoading, likes } = useSelector((state) => state.like);
  // console.log("likes: ", likes);

  let dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(getLikedPosts())
      .then((res) => {
        // console.log("posts:", res);

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
          title: `Error while getting liked posts: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch]);

  if (likeLoading) return <Loader />;

  return (
    <Container maxW={"container.xl"} h={"100vh"} p={"10"}>
      <Text fontSize={"3xl"}>
        Total Liked Posts {likes?.totalLikedPosts || 0}
      </Text>
      <VStack
        h={"100%"}
        gap={"8"}
        scrollBehavior={"smooth"}
        overflowY={"scroll"}
        style={{ scrollbarWidth: "none" }}
      >
        {likes?.posts?.length > 0 ? (
          likes?.posts?.map((item) => (
            <VStack
              key={item?.post?._id}
              h={"10rem"}
              w={"80%"}
              p={"4"}
              border={"1px solid purple"}
              rounded={"2xl"}
              justifyContent={"space-between"}
            >
              <HStack w={"full"} justifyContent={"space-between"}>
                <HStack>
                  <Avatar src={item?.postOwner?.avatar} />
                  {/*  */}
                  <Link to={`/profile/${item?.postOwner?._id}`}>
                    <Text fontSize={"lg"}>{item?.postOwner?.username}</Text>
                  </Link>
                  {/*  */}
                </HStack>
                <Text>{formatDate(item?.post?.createdAt)}</Text>
              </HStack>
              <HStack w={"full"} justifyContent={"flex-start"}>
                {/*  */}
                <Link to={`/postPage/${item?.post?._id}`}>
                  <Button variant={"link"} colorScheme="purple">
                    View Content
                  </Button>
                </Link>
                {/*  */}
              </HStack>
            </VStack>
          ))
        ) : (
          <Text colorScheme="red">No Liked Posts Found</Text>
        )}
      </VStack>
    </Container>
  );
};

export default GetAllLikedPostsPage;
