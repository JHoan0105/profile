/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Chakra imports
import React from "react";
import {
  Box,
  Flex,
  Heading,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";

// Custom components
import CenteredAuth from "layouts/auth/types/Centered";

function RecoveryEmail() {
  // Chakra color mode
  const textColor = useColorModeValue("guardianDark.100", "white");
  const textColorSecondary = "gray.400";

  // On click or on Submit to send Request to backend API

  return (
    <CenteredAuth
      image={"linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"}
      cardTop={{ base: "140px", md: "24vh" }}
      cardBottom={{ base: "50px", lg: "auto" }}>
      <Flex
        w='100%'
        maxW='max-content'
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        px={{ base: "25px", md: "0px" }}
        flexDirection='column'>
        <Box me='auto' mb='34px'>
          <Heading
            color={textColor}
            fontSize={{ base: "3xl", md: "36px" }}
            mb='16px'>
            Account Recovery
          </Heading>
          <Text
            color={textColorSecondary}
            fontSize='md'
            w={{ base: "100%", lg: "456px" }}
            maxW='100%'>
            <b>Your password reset email has been sent!</b>
          </Text>
        </Box>
      </Flex>
    </CenteredAuth>
  );
}

export default RecoveryEmail;