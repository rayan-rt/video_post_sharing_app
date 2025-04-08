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
import { postSignup } from "../redux/actions/user";

const Signup = () => {
  let { isAuthenticated, isError } = useSelector((state) => state.user);

  const [avatarFile, setAvatarFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [userData, setUserData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const toast = useToast();

  function handleInputChange(e) {
    const { name, value, files } = e.target;

    if (name === "avatar" || name === "coverImage") {
      setUserData({
        ...userData,
        [name]: files[0],
      });

      if (name === "avatar") {
        setAvatarFile(URL.createObjectURL(files[0]));
      } else if (name === "coverImage") {
        setCoverImageFile(URL.createObjectURL(files[0]));
      }
    } else {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  }

  function handleSignupSubmit(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append("fullName", userData.fullName);
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("avatar", userData.avatar);
    formData.append("coverImage", userData.coverImage);

    dispatch(postSignup(formData))
      .then((res) => {
        if (res.payload?.success) {
          // console.log("signup res:", res);

          navigate("/");
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 500,
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
          title: `Error while signing up: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

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
          {/* {isError && (
            <Text colorScheme="red" color={"red.400"}>
              {isError}
            </Text>
          )} */}

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
          <Input
            value={userData.password}
            onChange={handleInputChange}
            placeholder={"Password..."}
            type={"password"}
            name="password"
            focusBorderColor={"purple.500"}
            required
          />

          <Text>
            <label htmlFor="avatar">Avatar...</label>
            <Input
              onChange={handleInputChange}
              id="avatar"
              type={"file"}
              name="avatar"
              focusBorderColor={"purple.500"}
              accept="image/*"
              required
            />
            {avatarFile && <Avatar size={"lg"} src={avatarFile} />}
          </Text>

          <Text>
            <label htmlFor="coverImage">Cover Image...</label>
            <Input
              onChange={handleInputChange}
              id="coverImage"
              type={"file"}
              name="coverImage"
              focusBorderColor={"purple.500"}
              accept="image/*"
              required
            />
            {coverImageFile && <Avatar size={"lg"} src={coverImageFile} />}
          </Text>

          <Button colorScheme={"purple"} type={"submit"}>
            Sign Up
          </Button>

          <Button variant={"link"} colorScheme={"purple"}>
            <Link to={"/signin"}>Already have an account?</Link>
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default Signup;
