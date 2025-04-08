import { Button, Container, HStack, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { SubscribersPage, SubscriptionPage } from "./index";
import { Link } from "react-router-dom";

const Subscription = () => {
  const [tab, setTab] = useState("/subscription");

  return (
    <Container maxW={"container.xl"} h={"100vh"} py={"14"} px={"10"}>
      <VStack h={"full"} p={4} alignItems={"flex-start"}>
        <HStack gap={2}>
          <Button
            onClick={() => setTab("/subscription")}
            variant={tab === "/subscription" ? "outline" : "ghost"}
            colorScheme="purple"
          >
            Subscription
          </Button>

          <Button
            onClick={() => setTab("/subscribers")}
            variant={tab === "/subscribers" ? "outline" : "ghost"}
            colorScheme="purple"
          >
            Subscribers
          </Button>
        </HStack>

        {tab === "/subscription" ? <SubscriptionPage /> : <SubscribersPage />}
      </VStack>
    </Container>
  );
};

export default Subscription;
