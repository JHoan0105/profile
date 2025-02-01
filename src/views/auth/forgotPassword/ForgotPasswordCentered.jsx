/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.0.2
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import reset from "services/auth/sendReset";

import { EMAIL_REGEX } from 'variables/constants'

// Chakra imports
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useColorModeValue,
  Text,
  useToast,
} from "@chakra-ui/react";

// Custom components
import CenteredAuth from "layouts/auth/types/Centered";

// Default function
function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const msg = useRef(null);
  const emailInput = useRef(null);
  const nav = useNavigate();
  const toast = useToast();
  // Get the URL search parameters
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paramEmail = searchParams.get("email");

  // Chakra color mode
  const textColor = useColorModeValue("black", "white");
  const textColorSecondary = useColorModeValue('black', 'gray.400');
  const brandStars = useColorModeValue("brand.500", "brand.400");

  useEffect(() => {
    emailInput.current.value = paramEmail;
    emailInput.current.focus()
  }, [])


  const onFailed = () => {
    setFailed(true);
    setLoading(false);
    (() => {
      toast({
        title: 'Failed email password reset',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    })()
  }
  const onSuccess = () => {
    (() => {
      toast({
        title: 'Email reset sent successfully',
        status: "success",
        duration: 9000,
        isClosable: true,
      })
    })()
  }

  const ShowText = () => {
    return <Text
      color='Red'
      fontSize="md"
      w="100%"
      fontWeight="500"
      mb='20px'
      display={failed ? 'show' : 'none'}
    >
      {msg?.current || "Failed password reset."}
    </Text>
  };

  // On click or on Submit to send Request to backend API
  const handleReset = async () => {
    setLoading(true);
    if (!EMAIL_REGEX.test(emailInput?.current.value)) {
      onFailed();
      setFailed(() => true);
      msg.current = "Please enter a valid email address.";
      setLoading(false);
      return;
    }
    setFailed(() => false);
    const tempEmail = btoa(encodeURIComponent(emailInput?.current.value));
    const resetStatus = await reset(tempEmail);

    if (resetStatus) {
      onSuccess();
      nav('../forgot-password/Sent');
    } else {
      onFailed();
      setFailed(() => true);
      msg.current = "Reset password Failed!";
      setLoading(false);
    }
    return;
  }

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
            Forgot your password?
          </Heading>
          <Text
            color={textColorSecondary}
            fontSize='md'
            w={{ base: "100%", lg: "456px" }}
            maxW='100%'>
            No problem. Just let us know your email address and we'll email you
            a password reset link that will allow you to choose a new one.
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", lg: "456px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}
          align='start'>
          <FormControl>
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='16px'>
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              fontSize='sm'
              type='email'
              ref={emailInput}
              placeholder='mail@guardianmobility.com'
              mb='24px'
              size='lg'
              onKeyPress={(e) => e.key === 'Enter' ? handleReset() : null}
            />
            <ShowText />
            <Button
              isLoading={loading}
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'
              _hover={{ bg: "brand.600" }}
              _active={{ bg: "brand.500" }}
              _focus={{ bg: "brand.500" }}
              onClick={handleReset}
            >
              Send Email Password Reset Link
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </CenteredAuth>
  );
}

export default ForgotPassword;
