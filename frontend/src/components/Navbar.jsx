import { Link, useNavigate } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import ColorModeSwitcher from "../ColorModeSwitcher.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Button,
  useDisclosure,
  VStack,
  HStack,
  useToast,
  Text,
} from "@chakra-ui/react";
import { getSignout } from "../redux/actions/user.js";
import { useState } from "react";

const Navbar = () => {
  let { isAuthenticated, user } = useSelector((state) => state.user);
  // console.log("currentUser:", user);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const [tab, setTab] = useState("");

  async function handleSignout() {
    dispatch(getSignout())
      .then((res) => {
        // console.log("signed out:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "warning",
            duration: 500,
          });

          navigate("/signin");
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
          title: `Error while signing out: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );

    onClose();
  }

  return (
    <>
      <Button
        onClick={onOpen}
        zIndex={"overlay"}
        pos={"fixed"}
        top={"4"}
        left={"4"}
        colorScheme="purple"
        p={"0"}
        w={"5"}
        h={"8"}
        borderRadius={"md"}
      >
        <IoIosMenu size={"20"} />
      </Button>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />

        <DrawerContent>
          {/* <DrawerCloseButton /> */}

          <Link to={"/"} onClick={onClose}>
            <DrawerHeader>MY LIFE</DrawerHeader>
          </Link>
          <DrawerBody>
            <VStack alignItems={"flex-start"}>
              <Button
                onClick={() => {
                  setTab("/");
                  onClose();
                }}
                variant={tab === "/" ? "solid" : "ghost"}
                colorScheme={"purple"}
              >
                <Link to={"/"}>Home</Link>
              </Button>

              <Button
                onClick={() => {
                  setTab("/videos");
                  onClose();
                }}
                variant={tab === "/videos" ? "solid" : "ghost"}
                colorScheme={"purple"}
              >
                <Link to={"/videos"}>Videos</Link>
              </Button>

              <Button
                onClick={() => {
                  setTab("/liked_videos");
                  onClose();
                }}
                variant={tab === "/liked_videos" ? "solid" : "ghost"}
                colorScheme={"purple"}
              >
                <Link to={"/liked_videos"}>Liked Videos</Link>
              </Button>

              <Button
                onClick={() => {
                  setTab("/my_playlists");
                  onClose();
                }}
                variant={tab === "/my_playlists" ? "solid" : "ghost"}
                colorScheme={"purple"}
              >
                <Link to={"/my_playlists"}>Playlists</Link>
              </Button>

              <Button
                onClick={() => {
                  setTab("/posts");
                  onClose();
                }}
                variant={tab === "/posts" ? "solid" : "ghost"}
                colorScheme={"purple"}
              >
                <Link to={"/posts"}>Posts</Link>
              </Button>

              <Button
                onClick={() => {
                  setTab("/liked_posts");
                  onClose();
                }}
                variant={tab === "/liked_posts" ? "solid" : "ghost"}
                colorScheme={"purple"}
              >
                <Link to={"/liked_posts"}>Liked Posts</Link>
              </Button>

              <Button
                onClick={() => {
                  setTab("/subscription");
                  onClose();
                }}
                variant={tab === "/subscription" ? "solid" : "ghost"}
                colorScheme={"purple"}
              >
                <Link to={"/subscription"}>Subscription</Link>
              </Button>

              <Button
                onClick={() => {
                  setTab("/myprofile");
                  onClose();
                }}
                variant={tab === "/myprofile" ? "solid" : "ghost"}
                colorScheme={"purple"}
              >
                <Link to={`/myprofile`}>My Profile</Link>
              </Button>

              <Button
                onClick={onClose}
                variant={"outline"}
                colorScheme={"purple"}
              >
                <Link to={"/uploadVideoPage"}>Upload Video</Link>
              </Button>

              <Button
                onClick={onClose}
                variant={"outline"}
                colorScheme={"purple"}
              >
                <Link to={"/createPostPage"}>Create Post</Link>
              </Button>

              <ColorModeSwitcher />
            </VStack>

            <HStack
              pos={"absolute"}
              bottom={"10"}
              left={"0"}
              w={"full"}
              justifyContent={"space-evenly"}
            >
              {isAuthenticated ? (
                <VStack>
                  <Text colorScheme="purple" color={"purple.500"}>
                    Logged in as: {user?.username}
                  </Text>
                  <Button onClick={handleSignout} colorScheme={"red"}>
                    Sign Out
                  </Button>
                </VStack>
              ) : (
                <>
                  <Button onClick={onClose} colorScheme={"purple"}>
                    <Link to={"/signin"}>Sign In</Link>
                  </Button>

                  <Button
                    onClick={onClose}
                    colorScheme={"purple"}
                    variant={"outline"}
                  >
                    <Link to={"/signup"}>Sign Up</Link>
                  </Button>
                </>
              )}
            </HStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
