import { Button, HStack, Input, Stack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { getAllVideos, getSubscribedUsersVideos } from "../redux/actions/video";
import { useDispatch } from "react-redux";

const SearchBar = ({ isAll = true }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const toast = useToast();

  async function handleSearch(e) {
    e.preventDefault();

    dispatch(
      isAll
        ? getAllVideos({ query: searchQuery })
        : getSubscribedUsersVideos({ query: searchQuery })
    )
      .then((res) => {
        // console.log("posts:", res);

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
          title: `Error while getting ${
            isAll ? "all" : "subscribed users"
          } videos: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  return (
    <HStack
      // bg={"blue"}
      mt={["16", "4"]}
      mx={"auto"}
      w={"fit-content"}
    >
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={"search..."}
          type={"text"}
          borderColor={"purple.500"}
          color={"purple.500"}
        />
        <Button
          type="submit"
          variant={"outline"}
          colorScheme={"purple"}
          borderRadius={"full"}
          p={"0"}
          color={"purple.500"}
          borderColor={"purple.500"}
        >
          <MdOutlineSearch />
        </Button>
      </form>
    </HStack>
  );
};

export default SearchBar;
