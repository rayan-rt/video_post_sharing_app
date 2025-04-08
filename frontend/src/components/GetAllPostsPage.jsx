import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader, PaginationButton, PostBox } from "./index";
import { Link, useNavigate } from "react-router-dom";
import { getAllPosts } from "../redux/actions/post";
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

const GetAllPostsPage = () => {
  let { isLoading, posts } = useSelector((state) => state.post);
  // console.log("posts: ", posts);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    dispatch(getAllPosts({ userID: "", page, limit }))
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
          title: `Error while getting all posts: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch, page, limit]);

  if (isLoading) return <Loader />;

  return (
    <Container maxW={"container.xl"} h={"100vh"} p={"10"}>
      <VStack
        h={"fit-content"}
        gap={"8"}
        scrollBehavior={"smooth"}
        overflowY={"scroll"}
        // bg={"skyblue"}
        style={{ scrollbarWidth: "none" }}
      >
        {posts?.length > 0 ? (
          posts?.map((post) => (
            <PostBox
              key={post._id}
              postID={post._id}
              userAvatar={post.ownerInfo?.avatar}
              userID={post.ownerInfo?._id}
              userName={post.ownerInfo?.username}
              createdAt={post.createdAt}
            />
          ))
        ) : (
          <Text colorScheme="purple">No Post Found</Text>
        )}
      </VStack>

      {posts?.length > 0 && (
        <PaginationButton
          currentPage={page}
          itemsLength={posts?.length}
          limit={limit}
          onPageChange={setPage}
        />
      )}
    </Container>
  );
};

export default GetAllPostsPage;
