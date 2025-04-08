import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Container,
  Heading,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { patchChangePassword } from "../redux/actions/user";

// constants
const initialState = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const ChangePasswordPage = () => {
  // let { user } = useSelector((state) => state.user);

  const [userData, setUserData] = useState(initialState);

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const toast = useToast();

  function handleInputChange(e) {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  }

  function handleChangePassSubmit(e) {
    e.preventDefault();

    dispatch(patchChangePassword(userData))
      .then((res) => {
        // console.log("change password:", res);

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
          title: `Error while changing user password: ${err.message}`,
          status: "error",
          duration: 5000,
        })
      );
  }

  return (
    <Container maxW={"container.xl"} h={"100vh"} px={"16"} py={"8"}>
      <form onSubmit={handleChangePassSubmit}>
        <VStack
          alignItems={"stretch"}
          spacing={"8"}
          w={["full", "96"]}
          m={"auto"}
          my={"16"}
        >
          <Heading>My Life</Heading>

          <Input
            value={userData.oldPassword}
            onChange={handleInputChange}
            placeholder={"Old Password..."}
            type={"password"}
            name="oldPassword"
            focusBorderColor={"purple.500"}
            required
          />
          <Input
            value={userData.newPassword}
            onChange={handleInputChange}
            placeholder={"New Password..."}
            type={"password"}
            name="newPassword"
            focusBorderColor={"purple.500"}
            required
          />
          <Input
            value={userData.confirmNewPassword}
            onChange={handleInputChange}
            placeholder={"Confirm Password..."}
            type={"password"}
            name="confirmNewPassword"
            focusBorderColor={"purple.500"}
            required
          />

          <Button colorScheme={"purple"} type={"submit"}>
            Change
          </Button>

          <Link to={"/updateProfilePage"}>
            <Button variant={"link"} colorScheme={"purple"}>
              update your profile?
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

export default ChangePasswordPage;
