import { Link, useNavigate, useParams } from "react-router-dom";
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
import { useDispatch, useSelector } from "react-redux";
import {
  getPlaylistByID,
  patchUpdatePlaylist,
} from "../redux/actions/playlist";

// constants
const initialState = {
  name: "",
  description: "",
};

const UpdatePlaylistPage = () => {
  let { playlistID } = useParams();

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

  function handleUpdateSubmit(e) {
    e.preventDefault();

    dispatch(patchUpdatePlaylist({ playlistID, playlistData }))
      .then((res) => {
        // console.log("post:", res);

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
          title: `Error while updating playlist: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  useEffect(() => {
    dispatch(getPlaylistByID(playlistID))
      .then((res) => {
        // console.log("post:", res);

        if (res.payload?.success) {
          setPlaylistData({
            name: res.payload?.data?.name,
            description: res.payload?.data?.description,
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
          title: `Error while getting playlist: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch, playlistID]);

  return (
    <Container maxW={"container.xl"} h={"100vh"} px={"16"} py={"8"}>
      <form onSubmit={handleUpdateSubmit}>
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
            type={"text"}
            name="description"
            focusBorderColor={"purple.500"}
            required
          />

          <Button colorScheme={"purple"} type={"submit"}>
            Update
          </Button>

          <Link to={`/playlistPage/${playlistID}`}>
            <Button variant={"link"} colorScheme={"red"} type={"submit"}>
              Discard
            </Button>
          </Link>
        </VStack>
      </form>
    </Container>
  );
};

export default UpdatePlaylistPage;
