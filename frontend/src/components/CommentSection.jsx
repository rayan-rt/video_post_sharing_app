import {
  Avatar,
  Button,
  HStack,
  Input,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../constants/";
import {
  postCommentOnVideo,
  postCommentOnPost,
  deleteComment,
  patchUpdateComment,
} from "../redux/actions/comment";
import { toggleCommentLikeDislike } from "../redux/actions/like";

const CommentSection = ({
  totalComments,
  comments,
  ID,
  isVideo = false,
  isPost = false,
  owner,
}) => {
  let { user } = useSelector((state) => state.user);
  // console.log("currentUser: ", user);
  // console.log("comments:", comments);

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const toast = useToast();

  const [content, setContent] = useState("");
  const [commentID, setCommentID] = useState("");
  const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);

  function handleCommentSubmit(e) {
    e.preventDefault();

    if (isVideo) {
      dispatch(
        isEditModeEnabled
          ? patchUpdateComment({ commentID, content })
          : postCommentOnVideo({ videoID: ID, content })
      )
        .then((res) => {
          // console.log("post:", res);

          if (res.payload?.success) {
            toast({
              title: res.payload?.message,
              status: "success",
              duration: 1000,
            });

            setContent("");
            navigate(`/videoPage/${ID}`);
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
            title: `Error while submitting comment: ${err.message}`,
            status: "error",
            duration: 5000,
          })
        );
    }

    if (isPost) {
      dispatch(
        isEditModeEnabled
          ? patchUpdateComment({ commentID, content })
          : postCommentOnPost({ postID: ID, content })
      )
        .then((res) => {
          // console.log("post:", res);

          if (res.payload?.success) {
            toast({
              title: res.payload?.message,
              status: "success",
              duration: 1000,
            });

            setContent("");
            navigate(`/postPage/${ID}`);
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
            title: `Error while submitting comment: ${err.message}`,
            status: "error",
            duration: 5000,
          })
        );
    }
  }

  function handleDeleteComment(commentID) {
    dispatch(deleteComment(commentID))
      .then((res) => {
        // console.log("post:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 1000,
          });

          if (isVideo) navigate(`/videoPage/${ID}`);
          else navigate(`/postPage/${ID}`);
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
          title: `Error while deleting comment: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  function handleCommentLikeUnlike(commentID) {
    dispatch(toggleCommentLikeDislike(commentID))
      .then((res) => {
        // console.log("post:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 1000,
          });

          if (isVideo) navigate(`/videoPage/${ID}`);
          else navigate(`/postPage/${ID}`);
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
          title: `Error while toggling like/dislike on video comment: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  return (
    <VStack
      marginBlock={"4"}
      pt={"4"}
      borderBlockStart={"1px solid white"}
      w={"100%"}
      alignItems={"flex-start"}
      gap={"4"}
    >
      <HStack w={"full"} alignItems={"flex-start"}>
        <Text
          fontSize={"4xl"}
          fontWeight={"bold"}
        >{`Total Comments  ${totalComments}`}</Text>
      </HStack>

      {owner?._id !== user?._id && (
        <HStack alignItems={"flex-start"}>
          <Avatar src={user?.avatar} />
          <form onSubmit={handleCommentSubmit}>
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={"type..."}
              name="content"
              focusBorderColor={"purple.500"}
              required
            />
          </form>
        </HStack>
      )}

      <VStack gap={"12"} mt={"8"} alignItems={"flex-start"}>
        {comments?.map((comment) => (
          <VStack key={comment._id} gap={"2"} alignItems={"flex-start"}>
            <HStack alignItems={"flex-start"}>
              <Avatar src={comment?.owner?.avatar} size={"sm"} />
              <Link to={"/"}>
                <Text fontSize={"lg"} color={"gray.500"}>
                  {comment?.owner?.username}
                </Text>
              </Link>
              <Text fontSize={"sm"}>{formatDate(comment?.createdAt)}</Text>
            </HStack>

            <Text>{comment.content}</Text>

            <HStack>
              (
              <HStack>
                <Button
                  onClick={() => handleCommentLikeUnlike(comment?._id)}
                  disabled={comment?.owner?._id === user?._id}
                >
                  {comment?.isLikedByCurrentUser ? (
                    <IoMdHeart color="red" />
                  ) : (
                    <FaRegHeart color="red" />
                  )}
                </Button>
                <Text>{comment.likesCount}</Text>
              </HStack>
              )
              {user?._id === comment?.owner?._id && (
                <>
                  <Button
                    onClick={() => {
                      setContent(comment?.content);
                      setCommentID(comment?._id);
                      setIsEditModeEnabled(true);
                    }}
                    variant="solid"
                    colorScheme="purple"
                    size={"sm"}
                    disabled={isEditModeEnabled}
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => handleDeleteComment(comment?._id)}
                    variant={"solid"}
                    colorScheme="red"
                    size={"sm"}
                    disabled={isEditModeEnabled}
                  >
                    Delete
                  </Button>
                </>
              )}
            </HStack>
          </VStack>
        ))}
      </VStack>
    </VStack>
  );
};

export default CommentSection;
