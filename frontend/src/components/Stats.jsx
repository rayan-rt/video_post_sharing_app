import { HStack, Text, useToast, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { getStats } from "../redux/actions/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../constants/";
import { MdOutlineMail, MdOutlineOndemandVideo } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { FaRegFileImage } from "react-icons/fa6";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { BiLike } from "react-icons/bi";
import { GrCircleInformation } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa";

const Stats = ({ user }) => {
  let { stats } = useSelector((state) => state.dashboard);
  // console.log("stats:", stats);
  // console.log("user:", user);

  let dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(getStats(user?._id))
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
          title: `Error while fetching user's stats: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch]);

  return (
    <VStack alignItems={"flex-start"}>
      <HStack>
        <MdOutlineMail />
        <Text>{` Email ${stats?.userEmail}`}</Text>
      </HStack>

      <HStack>
        <RxAvatar />
        <Text>{` Subscribers ${stats?.totalSubscribers}`}</Text>
      </HStack>

      <HStack>
        <MdOutlineOndemandVideo />
        <Text>{` Videos ${stats?.totalVideos}`}</Text>
      </HStack>

      <HStack>
        <MdOutlineRemoveRedEye />
        <Text>{` Views on Videos ${stats?.totalVideoViews}`}</Text>
      </HStack>

      <HStack>
        <BiLike />
        <Text>{` Likes on Videos ${stats?.totalVideoLikes}`}</Text>
      </HStack>

      <HStack>
        <FaRegFileImage />
        <Text>{` Posts ${stats?.totalPosts}`}</Text>
      </HStack>

      <HStack>
        <BiLike />
        <Text>{` Likes on Posts ${stats?.totalPostLikes}`}</Text>
      </HStack>

      <HStack>
        <GrCircleInformation />
        <Text>{`Joined at ${formatDate(stats?.userCreatedAt)}`}</Text>
      </HStack>

      {/* 
      <HStack>
        <FaRegUser />
        <Text>{stats?.userAccount}</Text>
      </HStack>
      */}
    </VStack>
  );
};

export default Stats;
