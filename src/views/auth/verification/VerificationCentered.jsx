/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.0.2
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import OTPVerification from "views/auth/verification/OtpVerification";
import otpVerify from 'services/auth/otpVerify';
import getAccountInfo from 'services/account/getAccountInfo';

// Chakra imports
import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import CenteredAuth from "layouts/auth/types/Centered";
import React from "react";


// Default function
function ForgotPassword() {

  const toast = useToast();
  const accountInfo = getAccountInfo();

  // Chakra color mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("guardianDark.100", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");


  const handleReSend = async () => {
    // Request server to resend OTP
    const requestStatus = await otpVerify(accountInfo.firstName, accountInfo.email)

    if (requestStatus) {
      (() => {
        toast({
          title: `OTP sent successfully`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      })()
    } else {
      (() => {
        toast({
          title: 'Please allow 5 minutes before making another send OTP request.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      })()
    }
  }

  return (
    <CenteredAuth
      image={"linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"}
      cardTop={{ base: "140px", md: "24vh" }}
      cardBottom={{ base: "50px", lg: "auto" }}>
      <Flex
        w='100%'
        maxW='max-content'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        justifyContent='center'
        px={{ base: "25px", md: "0px" }}
        flexDirection='column'>
        <Box me='auto' mb='34px'>
          <Heading
            color={textColor}
            fontSize='36px'
            mb='16px'
            mx={{ base: "auto", lg: "unset" }}
            textAlign={{ base: "center", lg: "left" }}>
            2-Step Verification
          </Heading>
          <Text
            color={textColorSecondary}
            fontSize='md'
            maxW={{ base: "95%", md: "100%" }}
            mx={{ base: "auto", lg: "unset" }}
            textAlign={{ base: "center", lg: "left" }}>
            Enter your 2-Step Verification email code to unlock!
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "425px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          <OTPVerification />
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
            <Text
              color={textColorDetails}
              fontWeight='400'
              fontSize='14px'
              mx={{ base: "auto", lg: "unset" }}
              textAlign={{ base: "center", lg: "left" }}>
              Haven't received it?
              <Text color={textColorBrand} as='span' ms='5px' fontWeight='500' onClick={handleReSend} _hover={{ cursor: 'pointer' }}>
                Resend a new code
              </Text>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </CenteredAuth>
  );
}

export default ForgotPassword;
