import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Heading,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { postSignin } from "../redux/actions/user";
import { useDispatch } from "react-redux";

const Signin = () => {
  const [userData, setUserData] = useState({ username: "", password: "" });

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const toast = useToast();

  function handleInputChange(e) {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSigninSubmit(e) {
    e.preventDefault();

    dispatch(postSignin(userData))
      .then((res) => {
        // console.log("signed in user:", res);

        if (res.payload?.success) {
          toast({
            title: res.payload?.message,
            status: "success",
            duration: 500,
          });

          navigate("/");
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
          title: `Error while signing in: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  return (
    <Container maxW={"container.xl"} h={"100vh"} px={"16"} py={"8"}>
      <form onSubmit={handleSigninSubmit}>
        <VStack
          alignItems={"stretch"}
          spacing={"8"}
          w={["full", "96"]}
          m={"auto"}
          my={"16"}
        >
          <Heading>My Life</Heading>

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
            value={userData.password}
            onChange={handleInputChange}
            placeholder={"Password..."}
            type={"password"}
            name="password"
            focusBorderColor={"purple.500"}
            required
          />

          <Button colorScheme={"purple"} type={"submit"}>
            Sign In
          </Button>

          <Button variant={"link"} colorScheme={"purple"}>
            <Link to={"/signup"}>Don't have an account?</Link>
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default Signin;
