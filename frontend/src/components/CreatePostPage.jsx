import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Heading,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { postCreatePost } from "../redux/actions/post";

const CreatePostPage = () => {
  const [content, setContent] = useState("");

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const toast = useToast();

  function handlePostSubmit(e) {
    e.preventDefault();

    dispatch(postCreatePost({ content }))
      .then((res) => {
        // console.log("post:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 1000,
          });

          navigate("/posts");
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
          title: `Error while creating post: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  return (
    <Container maxW={"container.xl"} h={"100vh"} px={"16"} py={"8"}>
      <form onSubmit={handlePostSubmit}>
        <VStack
          alignItems={"stretch"}
          spacing={"8"}
          w={["full", "96"]}
          m={"auto"}
          my={"16"}
        >
          <Heading>My Life</Heading>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"Type..."}
            name="content"
            focusBorderColor={"purple.500"}
            required
          />

          <Button colorScheme={"purple"} type={"submit"}>
            Create
          </Button>

          <Link to={"/posts"}>
            <Button variant={"link"} colorScheme="red">
              Discard
            </Button>
          </Link>
        </VStack>
      </form>
    </Container>
  );
};

export default CreatePostPage;
