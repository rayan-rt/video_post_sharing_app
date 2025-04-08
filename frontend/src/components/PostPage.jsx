import {
  Container,
  VStack,
  HStack,
  Text,
  Avatar,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deletePost, getSinglePost } from "../redux/actions/post";
import { CommentSection, Loader } from "./index";
import { FaRegHeart } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { formatDate } from "../constants/";
import { togglePostLikeDislike } from "../redux/actions/like";

const PostPage = () => {
  let { postID } = useParams();

  let { isLoading, user } = useSelector((state) => state.user);
  let { isLoading: postLoading, post } = useSelector((state) => state.post);
  // console.log("post: ", post);
  // console.log("user:", user);
  // console.log("likeDate: ", likeData);

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const toast = useToast();

  function handleDeletePost() {
    dispatch(deletePost(postID))
      .then((res) => {
        // console.log("posts:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 1000,
          });

          navigate("/posts");
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
          title: `Error while deleting post: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  function togglePostLike() {
    dispatch(togglePostLikeDislike(postID))
      .then((res) => {
        console.log("like:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 1000,
          });

          navigate(`/postPage/${postID}`);
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
          title: `Error while toggling like/dislike on post: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  useEffect(() => {
    dispatch(getSinglePost(postID))
      .then((res) => {
        // console.log("post:", res);

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
          title: `Error while getting post: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch, postID]);

  if (isLoading || postLoading) return <Loader />;

  return (
    <Container
      maxW={"container.xl"}
      h={"100vh"}
      pt={"4"}
      display={"flex"}
      justifyContent={"center"}
    >
      <VStack
        h={"10rem"}
        w={"80%"}
        p={"4"}
        border={"1px solid purple"}
        rounded={"2xl"}
        justifyContent={"space-between"}
      >
        <HStack w={"full"} justifyContent={"space-between"}>
          <HStack>
            <Avatar src={post?.owner?.avatar} />
            <Link
              to={
                post?.owner?._id === user?._id
                  ? `/myprofile`
                  : `/profile/${post?.owner?._id}`
              }
            >
              <Text fontSize={"lg"}>{post?.owner?.username}</Text>
            </Link>
          </HStack>
          <Text>{formatDate(post?.createdAt)}</Text>
        </HStack>
        <HStack w={"full"} justifyContent={"flex-start"}>
          <Text>{post?.content}</Text>
        </HStack>
        <HStack
          w={"full"}
          justifyContent={
            post?.owner?._id === user?._id ? "space-evenly" : "flex-start"
          }
        >
          {post?.owner?._id !== user?._id && (
            <HStack>
              <Button onClick={togglePostLike}>
                {post?.isLikedByCurrentUser ? (
                  <IoMdHeart color="red" />
                ) : (
                  <FaRegHeart color="red" />
                )}
              </Button>
              <Text>{post?.totalLikes}</Text>
            </HStack>
          )}
          {post?.owner?._id === user?._id && (
            <>
              <Link to={`/updatePostPage/${postID}`}>
                <Button variant={"solid"} colorScheme={"purple"}>
                  Update
                </Button>
              </Link>
              <Button
                onClick={handleDeletePost}
                variant={"solid"}
                colorScheme={"red"}
              >
                Delete
              </Button>
            </>
          )}
        </HStack>

        <CommentSection
          totalComments={post?.totalComments}
          comments={post?.comments}
          ID={postID}
          isPost={true}
          owner={post?.owner}
        />
      </VStack>
    </Container>
  );
};

export default PostPage;
