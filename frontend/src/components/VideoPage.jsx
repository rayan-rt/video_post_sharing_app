import {
  Avatar,
  Button,
  Container,
  HStack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdPlaylistPlay } from "react-icons/md";
import { formatDate } from "../constants/";
import { useDispatch, useSelector } from "react-redux";
import { getSingleVideo } from "../redux/actions/video";
import { CommentSection, Loader } from "./index";
import { FaRegHeart } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { toggleVideoLikeDislike } from "../redux/actions/like";
import {
  checkSubscription,
  toggleSubscription,
} from "../redux/actions/subscription";

const VideoPage = () => {
  let { videoID } = useParams();
  //   console.log("videoID: ", videoID);

  let { isLoading, user } = useSelector((state) => state.user);
  let { subscription } = useSelector((state) => state.subscription);
  let { isLoading: videoLoading, video } = useSelector((state) => state.video);
  // console.log("currentUser: ", user);
  // console.log("video:", video);
  // console.log("likdeData:", likeData);
  // console.log("subscription:", subscription);

  let dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    dispatch(getSingleVideo(videoID))
      .then((res) => {
        // console.log("subscription:", res);

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
          title: `Error while getting video: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch, videoID]);

  function toggleVideoLike() {
    dispatch(toggleVideoLikeDislike(videoID))
      .then((res) => {
        // console.log("like:", res);

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
          title: `Error while toggling like/dislike on video: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  function handleSubscription() {
    dispatch(toggleSubscription(video?.owner?._id))
      .then((res) => {
        // console.log("subscription:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 500,
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
          title: `Error while ${
            subscription?.isSubscribed ? "unsubscribing" : "subscribing"
          }: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  if (isLoading || videoLoading) return <Loader />;

  return (
    <Container maxW={"container.xl"} h={"100vh"} py={"14"} px={"10"}>
      <VStack alignItems={"flex-start"} gap={"4"} maxW={"full"}>
        <video
          src={video?.videoFile}
          controls
          style={{ minWidth: "100%", maxWidth: "100%" }}
        ></video>
        <Text fontSize={"2xl"}>{video?.title}</Text>
        <HStack w={"full"} justifyContent={"space-between"}>
          <HStack gap={"4"}>
            <Avatar src={video?.owner?.avatar} />

            <VStack alignItems={"flex-start"} gap={"-2"}>
              <Link
                to={
                  video?.owner?._id === user._id
                    ? `/myProfile`
                    : `/profile/${video?.owner?._id}`
                }
              >
                <Text color={"gray"}>{video?.owner?.username}</Text>
              </Link>
              <Text>{`${video?.totalSubscribers} ${
                video?.totalSubscribers > 1 ? "Subscribers" : "Subscriber"
              }`}</Text>
            </VStack>

            {video?.owner?._id !== user?._id && (
              <Button
                onClick={handleSubscription}
                variant={video?.isSubscribedByCurrentUser ? "outline" : "solid"}
                colorScheme="purple"
              >
                {video?.isSubscribedByCurrentUser ? "Subscribed" : "Subscribe"}
              </Button>
            )}
          </HStack>

          {video?.owner?._id !== user?._id && (
            <HStack>
              <HStack>
                <Button onClick={toggleVideoLike}>
                  {video?.isLikedByCurrentUser ? (
                    <IoMdHeart color="red" />
                  ) : (
                    <FaRegHeart color="red" />
                  )}
                </Button>
                <Text>{video?.totalLikes}</Text>
              </HStack>
              <Link to={`/addToPlaylistPage/${videoID}`}>
                <Button variant={"ghost"} colorScheme="purple">
                  Add to playlist <MdPlaylistPlay />
                </Button>
              </Link>
            </HStack>
          )}
        </HStack>
        <HStack>
          <Text>{`${video?.views} ${
            video?.views > 1 ? "views" : "view"
          }`}</Text>
          <Text fontSize={"sm"}>{formatDate(video?.createdAt)}</Text>
        </HStack>
        <Text>{video?.description}</Text>

        <CommentSection
          totalComments={video?.totalComments}
          comments={video?.comments}
          ID={videoID}
          isVideo={true}
          owner={video?.owner}
        />
      </VStack>
    </Container>
  );
};

export default VideoPage;
