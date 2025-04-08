import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Button,
  Container,
  Heading,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { patchUpdateAvatar } from "../redux/actions/user";

const ChangeAvatarPage = () => {
  let { user } = useSelector((state) => state.user);

  const [avatarFile, setAvatarFile] = useState(user?.avatar);
  const [avatar, setAvatar] = useState(null);

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const toast = useToast();

  function handleInputChange(e) {
    setAvatar(e.target.files[0]);
    setAvatarFile(URL.createObjectURL(e.target.files[0]));
  }

  async function handleAvatarSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("avatar", avatar);

    dispatch(patchUpdateAvatar(formData))
      .then((res) => {
        // console.log("change avatar:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 1000,
          });

          setAvatar(null);
          navigate(`/myprofile`);
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
          title: `Error while updating avatar: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  return (
    <Container maxW={"container.xl"} h={"100vh"} px={"16"} py={"8"}>
      <form onSubmit={handleAvatarSubmit} encType="multipart/form-data">
        <VStack
          alignItems={"stretch"}
          spacing={"8"}
          w={["full", "96"]}
          m={"auto"}
          my={"16"}
        >
          <Heading>My Life</Heading>

          {avatarFile && <Avatar size={"lg"} src={avatarFile} />}

          <Text>
            <label htmlFor="avatar">Avatar...</label>
            <Input
              onChange={handleInputChange}
              id="avatar"
              type={"file"}
              name="avatar"
              focusBorderColor={"purple.500"}
              accept="image/*"
              required
            />
          </Text>

          <Button colorScheme={"purple"} type={"submit"}>
            Change Avatar
          </Button>

          <Link to={"/updateProfilePage"}>
            <Button variant={"link"} colorScheme={"purple"}>
              update your profile?
            </Button>
          </Link>

          <Link to={"/changePasswordPage"}>
            <Button variant={"link"} colorScheme={"purple"}>
              change your password?
            </Button>
          </Link>

          <Link to={"/changeCoverImagePage"}>
            <Button variant={"link"} colorScheme={"purple"}>
              change your cover image?
            </Button>
          </Link>

          <Link to={"/myprofile"}>
            <Button variant={"link"} colorScheme={"red"}>
              Discard Changes
            </Button>
          </Link>
        </VStack>
      </form>
    </Container>
  );
};

export default ChangeAvatarPage;
