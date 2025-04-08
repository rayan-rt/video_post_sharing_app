import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
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
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { postUploadVideo } from "../redux/actions/video";

// constants
const initialState = {
  title: "",
  description: "",
  thumbnail: null,
  videoFile: null,
  isPublished: true,
};

const UploadVideoPage = () => {
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoData, setVideoData] = useState(initialState);

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const toast = useToast();

  function handleInputChange(e) {
    const { name, value, files, type, checked } = e.target;

    if (name === "thumbnail" || name === "videoFile") {
      setVideoData({
        ...videoData,
        [name]: files[0],
      });

      if (name === "thumbnail") {
        setThumbnailFile(URL.createObjectURL(files[0]));
      } else if (name === "videoFile") {
        setVideoFile(URL.createObjectURL(files[0]));
      }
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

  async function handleSignupSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", videoData.title);
    formData.append("description", videoData.description);
    formData.append("thumbnail", videoData.thumbnail);
    formData.append("videoFile", videoData.videoFile);
    formData.append("isPublished", videoData.isPublished);

    dispatch(postUploadVideo(formData))
      .then((res) => {
        // console.log("video:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 1000,
          });

          navigate("/videos");
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
          title: `Error while creating video: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  return (
    <Container maxW={"container.xl"} h={"100vh"} px={"16"} py={"8"}>
      <form onSubmit={handleSignupSubmit} encType="multipart/form-data">
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
            <label htmlFor="videoFile">Video File...</label>
            <Input
              onChange={handleInputChange}
              id="videoFile"
              type={"file"}
              name="videoFile"
              focusBorderColor={"purple.500"}
              accept="video/*"
              required
            />
          </Text>

          <Text>
            <Text>{videoData.isPublished ? "Public" : "Private"}</Text>
            <Switch
              id="isPublished"
              isChecked={videoData.isPublished}
              onChange={handleInputChange}
              colorScheme="purple"
            />
          </Text>

          <Button colorScheme={"purple"} type={"submit"}>
            Upload
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

export default UploadVideoPage;
