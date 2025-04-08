import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import { patchUpdateCoverImage } from "../redux/actions/user";

const ChangeCoverImagePage = () => {
  let { user } = useSelector((state) => state.user);

  const [coverImageFile, setCoverImageFile] = useState(user?.coverImage);
  const [coverImage, setCoverImage] = useState(null);

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const toast = useToast();

  function handleInputChange(e) {
    setCoverImage(e.target.files[0]);
    setCoverImageFile(URL.createObjectURL(e.target.files[0]));
  }

  async function handleCoverSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("coverImage", coverImage);

    dispatch(patchUpdateCoverImage(formData))
      .then((res) => {
        // console.log("update cover image:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 1000,
          });

          setCoverImage(null);
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
          title: `Error while updating cover image: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  return (
    <Container maxW={"container.xl"} h={"100vh"} px={"16"} py={"8"}>
      <form onSubmit={handleCoverSubmit} encType="multipart/form-data">
        <VStack
          alignItems={"stretch"}
          spacing={"8"}
          w={["full", "96"]}
          m={"auto"}
          my={"16"}
        >
          <Heading>My Life</Heading>

          {coverImageFile && <Avatar size={"lg"} src={coverImageFile} />}

          <Text>
            <label htmlFor="coverImage">coverImage...</label>
            <Input
              onChange={handleInputChange}
              id="coverImage"
              type={"file"}
              name="coverImage"
              focusBorderColor={"purple.500"}
              accept="image/*"
              required
            />
          </Text>

          <Button colorScheme={"purple"} type={"submit"}>
            Change Cover
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

          <Link to={"/changeAvatarPage"}>
            <Button variant={"link"} colorScheme={"purple"}>
              change your avatar?
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

export default ChangeCoverImagePage;
