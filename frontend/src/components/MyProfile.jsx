import React, { useMemo, useState } from "react";
import { Container } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Avatar, Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { Stats, Videos, Posts, History } from "./index";
import { RxAvatar } from "react-icons/rx";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { FaRegFileImage } from "react-icons/fa6";

const MyProfile = () => {
  const { user } = useSelector((state) => state.user);
  console.log("me:", user);

  const [tab, setTab] = useState("");

  const TabContentComponent = useMemo(() => {
    switch (tab) {
      case "/stats":
        return <Stats user={user} />;
      case "/videos":
        return <Videos user={user} />;
      case "/posts":
        return <Posts user={user} />;
      case "/history":
        return <History user={user} />;
      default:
        return null;
    }
  }, [tab, user]);

  return (
    <Container maxW={"container.xl"} h={"100vh"} py={12} px={4}>
      <VStack overflowY={"auto"} gap={4} alignItems={"flex-start"} w={"full"}>
        <Image src={user?.coverImage} alt="cover_image" w={"full"} />
        <HStack w={"full"} px={4} justifyContent={"space-between"}>
          <HStack>
            <Avatar src={user?.avatar} />
            <VStack gap={-2} alignItems={"flex-start"}>
              <Text>{user?.username}</Text>
              <Text>{user?.fullName}</Text>
              <Text>{user?.email}</Text>
            </VStack>
          </HStack>

          <HStack>
            <Text align={"center"}>
              <RxAvatar /> {user?.subscribers?.length}
            </Text>
            <Text align={"center"}>
              <MdOutlineOndemandVideo /> {user?.videos?.length}
            </Text>
            <Text align={"center"}>
              <FaRegFileImage /> {user?.posts?.length}
            </Text>
          </HStack>
        </HStack>
        (
        <Link to={"/updateProfilePage"}>
          <Button colorScheme="purple">
            Customize <MdEdit />
          </Button>
        </Link>
        )
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

          <Button
            onClick={() => setTab("/history")}
            colorScheme="purple"
            variant={tab === "/history" ? "outline" : "ghost"}
            size={["xs", "md"]}
          >
            History
          </Button>
        </HStack>
        {TabContentComponent}
      </VStack>
    </Container>
  );
};

export default MyProfile;
