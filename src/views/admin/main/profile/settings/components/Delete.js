// Chakra imports
//NOT USING
import {
  Button,
  Flex,
  LightMode,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React from "react";

export default function Settings() {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("black", "white");
    const textColorSecondary = useColorModeValue("black", "white");
  return (
    <Card
      p='60px 30px'
      flexDirection={{ base: "column", lg: "row" }}
      alignItems='center'>
      <Flex direction='column'>
        <Text fontSize='xl' color={textColorPrimary} fontWeight='bold'>
          Do you want to leave us? 😔
        </Text>
        <Text fontSize='md' color={textColorSecondary}>
          Here you can permanently delete your account
        </Text>
      </Flex>
      <LightMode>
        <Button
          colorScheme='red'
          variant='outline'
          p='15px 40px'
          fontSize='sm'
          fontWeight='500'
          _hover={{ bg: "whiteAlpha.100" }}
          _focus={{ bg: "transparent" }}
          _active={{ bg: "transparent" }}
          ms='auto'>
          Delete account
        </Button>
      </LightMode>
    </Card>
  );
}
