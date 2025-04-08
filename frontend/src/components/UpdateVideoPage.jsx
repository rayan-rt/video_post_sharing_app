import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  Switch,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import { getSingleVideo, patchUpdateVideo } from "../redux/actions/video";

// constants
const initialState = {
  title: "",
  description: "",
  thumbnail: "",
  isPublished: true,
};

const UpdateVideoPage = () => {
  const { videoID } = useParams();

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoData, setVideoData] = useState(initialState);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    dispatch(getSingleVideo(videoID))
      .then((res) => {
        // console.log("post:", res);

        if (res.payload?.success) {
          let tempData = {
            title: res?.payload?.data.title,
            description: res?.payload?.data.description,
            isPublished: res?.payload?.data.isPublished,
          };
          setVideoData(tempData);
          setThumbnailFile(res.payload?.data.thumbnail);
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
          title: `Error while getting post: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch, videoID]);

  function handleInputChange(e) {
    const { name, value, files, type, checked } = e.target;

    if (name === "thumbnail") {
      setVideoData({
        ...videoData,
        [name]: files[0],
      });
      setThumbnailFile(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setVideoData({
        ...videoData,
        isPublished: checked,
      });
    } else {
      setVideoData({
        ...videoData,
        [name]: value,
      });
    }
  }

  async function handleUpdateVideoSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", videoData.title);
    formData.append("description", videoData.description);
    formData.append("thumbnail", videoData.thumbnail);
    formData.append("isPublished", videoData.isPublished);

    dispatch(patchUpdateVideo({ videoID, videoData: formData }))
      .then((res) => {
        // console.log("post:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 1000,
          });

          navigate("/myprofile");
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
          title: `Error while updating post: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  return (
    <Container maxW={"container.xl"} h={"100vh"} px={"16"} py={"8"}>
      <form onSubmit={handleUpdateVideoSubmit} encType="multipart/form-data">
        <VStack
          alignItems={"stretch"}
          spacing={"8"}
          w={["full", "96"]}
          m={"auto"}
          my={"16"}
        >
          <Heading>My Life</Heading>

          <Input
            value={videoData.title}
            onChange={handleInputChange}
            placeholder={"Title..."}
            type={"text"}
            name="title"
            focusBorderColor={"purple.500"}
            required
          />
          <Textarea
            value={videoData.description}
            onChange={handleInputChange}
            placeholder={"Description..."}
            name="description"
            focusBorderColor={"purple.500"}
            required
          />

          <Text>
            <label htmlFor="thumbnail">Thumbnail...</label>
            <Input
              onChange={handleInputChange}
              id="thumbnail"
              type={"file"}
              name="thumbnail"
              focusBorderColor={"purple.500"}
              accept="image/*"
              required
            />
            {thumbnailFile && <Avatar size={"lg"} src={thumbnailFile} />}
          </Text>

          <Text>
            <Text>{videoData.isPublished ? "private" : "public"}</Text>
            <Switch
              id="isPublished"
              isChecked={videoData.isPublished}
              onChange={handleInputChange}
              colorScheme="purple"
            />
          </Text>

          <Button colorScheme={"purple"} type={"submit"}>
            Update
          </Button>

          <Link to={"/videos"}>
            <Button variant={"link"} colorScheme="red">
              Discard
            </Button>
          </Link>
        </VStack>
      </form>
    </Container>
  );
};

export default UpdateVideoPage;
