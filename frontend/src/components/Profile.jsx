import {
  Avatar,
  Button,
  Container,
  HStack,
  Image,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleUser } from "../redux/actions/user";
import { Stats, Videos, Posts } from "./index";
import {
  checkSubscription,
  toggleSubscription,
} from "../redux/actions/subscription";
import React from "react";
import { FaRegFileImage } from "react-icons/fa6";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";

const Profile = () => {
  const { userID } = useParams();
  const { requestedUser } = useSelector((state) => state.user);
  const { subscription } = useSelector((state) => state.subscription);

  const [tab, setTab] = useState("");

  const dispatch = useDispatch();
  const toast = useToast();

  const handleSubscription = (channelID) => {
    dispatch(toggleSubscription(channelID))
      .then((res) => {
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
            subscription ? "unsubscribing" : "subscribing"
          }: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  };

  const TabContentComponent = useMemo(() => {
    switch (tab) {
      case "/stats":
        return <Stats user={requestedUser} />;
      case "/videos":
        return <Videos user={requestedUser} />;
      case "/posts":
        return <Posts user={requestedUser} />;
      default:
        return null;
    }
  }, [tab, requestedUser]);

  useEffect(() => {
    if (userID && !requestedUser) {
      dispatch(fetchSingleUser(userID))
        .then((res) => {
          if (res.payload?.success) {
            dispatch(checkSubscription(userID))
              .then((res) => {
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
                  title: `Error while checking subscription: ${err.message}`,
                  status: "error",
                  duration: 5000,
                })
              );
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
            title: `Error while fetching user: ${err.message}`,
            status: "error",
            duration: 5000,
          })
        );
    }
  }, [userID, dispatch]);

  return (
    <Container maxW={"container.xl"} h={"100vh"} py={12} px={4}>
      <VStack overflowY={"auto"} gap={4} alignItems={"flex-start"} w={"full"}>
        <Image src={requestedUser?.coverImage} alt="cover_image" w={"full"} />

        <HStack w={"full"} px={4} justifyContent={"space-between"}>
          <HStack>
            <Avatar src={requestedUser?.avatar} />
            <VStack gap={-2} alignItems={"flex-start"}>
              <Text>{requestedUser?.username}</Text>
              <Text>{requestedUser?.fullName}</Text>
              <Text>{requestedUser?.email}</Text>
            </VStack>
          </HStack>

          <HStack>
            <Text align={"center"}>
              <RxAvatar /> {requestedUser?.subscribers?.length}
            </Text>
            <Text align={"center"}>
              <MdOutlineOndemandVideo /> {requestedUser?.videos?.length}
            </Text>
            <Text align={"center"}>
              <FaRegFileImage /> {requestedUser?.posts?.length}
            </Text>
          </HStack>
        </HStack>

        <Button
          onClick={() => handleSubscription(requestedUser?._id)}
          colorScheme="purple"
          variant={subscription?.isSubscribed ? "outline" : "solid"}
        >
          {subscription?.isSubscribed ? "Subscribed" : "Subscribe"}
        </Button>

        <HStack>
          <Button
            onClick={() => setTab("/stats")}
            colorScheme="purple"
            variant={tab === "/stats" ? "outline" : "ghost"}
            size={["xs", "md"]}
          >
            Stats
          </Button>
          <Button
            onClick={() => setTab("/videos")}
            colorScheme="purple"
            variant={tab === "/videos" ? "outline" : "ghost"}
            size={["xs", "md"]}
          >
            Videos
          </Button>
          <Button
            onClick={() => setTab("/posts")}
            colorScheme="purple"
            variant={tab === "/posts" ? "outline" : "ghost"}
            size={["xs", "md"]}
          >
            Posts
          </Button>
        </HStack>

        {TabContentComponent}
      </VStack>
    </Container>
  );
};

export default Profile;
