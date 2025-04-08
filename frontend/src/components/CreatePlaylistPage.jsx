import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Container,
  Heading,
  Input,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { postSignin } from "../redux/actions/user";
import { useDispatch, useSelector } from "react-redux";
import { postCreatePlaylist } from "../redux/actions/playlist";

// constants
const initialState = {
  name: "",
  description: "",
};

const CreatePlaylistPage = () => {
  const [playlistData, setPlaylistData] = useState(initialState);

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const toast = useToast();

  function handleInputChange(e) {
    setPlaylistData({
      ...playlistData,
      [e.target.name]: e.target.value,
    });
  }

  async function handlePlaylistSubmit(e) {
    e.preventDefault();

    dispatch(postCreatePlaylist(playlistData))
      .then((res) => {
        // console.log("playlist:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 1000,
          });

          navigate("/my_playlists");
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
          title: `Error while creating playlist: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  return (
    <Container maxW={"container.xl"} h={"100vh"} px={"16"} py={"8"}>
      <form onSubmit={handlePlaylistSubmit}>
        <VStack
          alignItems={"stretch"}
          spacing={"8"}
          w={["full", "96"]}
          m={"auto"}
          my={"16"}
        >
          <Input
            value={playlistData.name}
            onChange={handleInputChange}
            placeholder={"Name..."}
            type={"text"}
            name="name"
            focusBorderColor={"purple.500"}
            required
          />
          <Textarea
            value={playlistData.description}
            onChange={handleInputChange}
            placeholder={"Description..."}
            name="description"
            focusBorderColor={"purple.500"}
            required
          />

          <Button colorScheme={"purple"} type={"submit"}>
            Create
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default CreatePlaylistPage;
