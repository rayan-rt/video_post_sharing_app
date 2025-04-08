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
import { patchUpdateUserInfo } from "../redux/actions/user";

// constants
const initialState = {
  fullName: "",
  username: "",
  email: "",
};

const UpdateForm = () => {
  let { user } = useSelector((state) => state.user);
  // console.log("user", user);

  const [userData, setUserData] = useState(initialState);

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const toast = useToast();

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  }

  async function handleUpdateSubmit(e) {
    e.preventDefault();

    dispatch(patchUpdateUserInfo(userData))
      .then((res) => {
        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 1000,
          });

          setUserData(initialState);
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
          title: `Error while updating user info: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  useEffect(() => {
    setUserData({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
    });
  }, [dispatch, user]);

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
          <Heading>My Life</Heading>

          <Input
            value={userData.fullName}
            onChange={handleInputChange}
            placeholder={"Full Name..."}
            type={"text"}
            name="fullName"
            focusBorderColor={"purple.500"}
            required
          />
          <Input
            value={userData.username}
            onChange={handleInputChange}
            placeholder={"Username..."}
            type={"text"}
            name="username"
            focusBorderColor={"purple.500"}
            required
          />
          <Input
            value={userData.email}
            onChange={handleInputChange}
            placeholder={"Email..."}
            type={"email"}
            name="email"
            focusBorderColor={"purple.500"}
            required
          />

          <Button colorScheme={"purple"} type={"submit"}>
            Update
          </Button>

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

export default UpdateForm;
