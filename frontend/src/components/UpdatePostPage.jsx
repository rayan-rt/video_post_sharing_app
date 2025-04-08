import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Container,
  Heading,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSinglePost, patchUpdatePost } from "../redux/actions/post";
import { Loader } from "./index";

const UpdatePostPage = () => {
  let { postID } = useParams();
  // console.log(postID);

  let { isLoading: postLoading, post } = useSelector((state) => state.post);

  const [content, setContent] = useState(post?.content || "");

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const toast = useToast();

  async function handlePostSubmit(e) {
    e.preventDefault();

    dispatch(patchUpdatePost({ postID, content }))
      .then((res) => {
        // console.log("post:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 1000,
          });

          navigate(`/postPage/${postID}`);
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
  }

  useEffect(() => {
    dispatch(getSinglePost(postID))
      .then((res) => {
        // console.log("post:", res);

        if (res.payload?.success) {
          setContent(res.payload?.data?.content);
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
  }, [dispatch, postID]);

  if (postLoading) return <Loader />;

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
            Update
          </Button>

          <Link to={`/postPage/${postID}`}>
            <Button colorScheme="red" variant="link">
              Discard
            </Button>
          </Link>
        </VStack>
      </form>
    </Container>
  );
};

export default UpdatePostPage;
