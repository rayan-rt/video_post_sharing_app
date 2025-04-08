import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../redux/actions/dashboard";
import { PostBox } from "./index";
import { Text, useToast } from "@chakra-ui/react";

const Posts = ({ user }) => {
  let { posts } = useSelector((state) => state.dashboard);
  // console.log("posts:", posts);
  // console.log("user:", user);

  let dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(getPosts(user?._id))
      .then((res) => {
        if (res.payload?.success) {
          return;
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
          title: `Error while fetching user's posts: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }, [dispatch]);

  return (
    <>
      {posts?.length > 0 ? (
        posts?.map((post) => (
          <PostBox
            key={post._id}
            postID={post._id}
            createdAt={post.createdAt}
          />
        ))
      ) : (
        <Text colorScheme="purple">No Post Found</Text>
      )}
    </>
  );
};

export default Posts;
