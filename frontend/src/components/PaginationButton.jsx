import { Button, HStack, Text } from "@chakra-ui/react";
import React from "react";

const PaginationButton = ({
  currentPage,
  itemsLength,
  limit,
  onPageChange,
}) => {
  return (
    <HStack
      w={"fit-content"}
      h={"fit-content"}
      gap={4}
      mb={2}
      mt={["4", "8", "12"]}
      mx={"auto"}
    >
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant={currentPage === 1 ? "ghost" : "solid"}
        colorScheme="purple"
        size={["sm", "md", "lg"]}
      >
        {"<"}
      </Button>
      <Text fontSize={["md", "lg", "xl"]}>{currentPage}</Text>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={itemsLength < limit}
        variant={itemsLength < limit ? "ghost" : "solid"}
        colorScheme="purple"
        size={["sm", "md", "lg"]}
      >
        {">"}
      </Button>
    </HStack>
  );
};

export default PaginationButton;
