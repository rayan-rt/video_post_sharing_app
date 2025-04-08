import { Avatar, HStack, Text, useToast, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Loader } from "./index";
import { getSubscribers } from "../redux/actions/subscription";

const SubscribersPage = () => {
  let { isLoading, user } = useSelector((state) => state.user);
  let { data: subscriptionData, mySubscribers } = useSelector(
    (state) => state.subscription
  );
  //   console.log("currentUser:", user);
  //   console.log("subscriptionData", subscriptionData);

  let dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(getSubscribers(user?._id))
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
          title: `Error while getting subscribers: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch]);

  if (isLoading) return <Loader />;

  return (
    <VStack gap={8} alignItems={"flex-start"}>
      <Text mt={4} fontSize={"2xl"}>
        Subscribers {mySubscribers?.length}
      </Text>

      <VStack
        gap={8}
        overflowY={"scroll"}
        alignItems={"flex-start"}
        style={{ scrollbarWidth: "none" }}
      >
        {mySubscribers?.length > 0 &&
          mySubscribers?.map((subscriber) => (
            <HStack key={subscriber._id}>
              <Avatar src={subscriber.avatar} />

              <VStack gap={-2} alignItems={"flex-start"}>
                <Text>{subscriber.fullName}</Text>
                <Link to={`/profile/${subscriber._id}`}>
                  <Text color={"gray"}>{subscriber.username}</Text>
                </Link>
              </VStack>
            </HStack>
          ))}
      </VStack>
    </VStack>
  );
};

export default SubscribersPage;
