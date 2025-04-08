import {
  Avatar,
  Button,
  HStack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Loader } from "./index";
import {
  getSubscribedChannels,
  toggleSubscription,
} from "../redux/actions/subscription";

const SubscriptionPage = () => {
  let { isLoading, user } = useSelector((state) => state.user);
  let { mySubscriptions, subscription } = useSelector(
    (state) => state.subscription
  );
  //   console.log("currentUser:", user);
  // console.log("subscriptionData", mySubscriptions);

  let dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(getSubscribedChannels())
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
          title: `Error while getting subscribed channels: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch]);

  function handleSubscription(channelID) {
    dispatch(toggleSubscription(channelID))
      .then((res) => {
        // console.log("subscription:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 500,
          });

          dispatch(getSubscribedChannels());
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

  if (isLoading) return <Loader />;

  return (
    <VStack gap={8} alignItems={"flex-start"}>
      <Text mt={4} fontSize={"2xl"}>
        Subscription {mySubscriptions?.length}
      </Text>

      <VStack
        gap={8}
        overflowY={"scroll"}
        alignItems={"flex-start"}
        style={{ scrollbarWidth: "none" }}
      >
        {mySubscriptions?.length > 0 &&
          mySubscriptions?.map((subscription) => (
            <HStack key={subscription._id} gap={12}>
              <HStack gap={2}>
                <Avatar src={subscription.avatar} />

                <VStack gap={-2} alignItems={"flex-start"}>
                  <Text>{subscription.fullName}</Text>
                  <Link to={`/profile/${subscription._id}`}>
                    <Text>{subscription.username}</Text>
                  </Link>
                </VStack>
              </HStack>

              <Button
                onClick={() => handleSubscription(subscription._id)}
                colorScheme="red"
              >
                Unsubscribe
              </Button>
            </HStack>
          ))}
      </VStack>
    </VStack>
  );
};

export default SubscriptionPage;
