/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import updateUserAccess from 'services/account/updateUserAccess';

// Chakra imports
import {
  Button,
  Flex,
  Text,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React, { useEffect, useState, useRef } from "react";

// Default function
export default function Block({ accountInfo, jwtAccountInfo, mb }) {
  const textColorSecondary = "grey";
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const toast = useToast();
  let msg = useRef(null)

  // State for user access   
  const [isUserAccess, setIsUserAccessEnabled] = useState(accountInfo.isUserAccess);

  useEffect(() => {
    setIsUserAccessEnabled(accountInfo.isUserAccess);

  }, [accountInfo.isUserAccess]);

  // Handle user access buttons click
  const handleUserAccessClick = () => {
    setIsUserAccessEnabled(prevState => !prevState); // Toggle state
    try {
      // API request to update access setting   
      const update = updateUserAccess(accountInfo.id, isUserAccess);
      if (!update) {
        msg.current.innerText = "Error : failed udpate.";
        (() => { onFailed(); })()
        return;
      }
      else {
        //On Success Toast message
        onSuccess();
      }
    } catch (error) {
      console.log("request error");
      (() => { onFailed(); })()
    }
  };

  const onFailed = () => {

    (() => {
      toast({
        title: 'Failed change access setting.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    })()
  }

  const onSuccess = () => {

    (() => {
      toast({
        title: 'Successfully changed access setting.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
    })()
  }

  return (
    <Card
      p='30px'
      py='34px'
      flexDirection={{ base: "column", md: "row", lg: "row" }}
      alignItems='center'
      mb={mb}>

      <Flex justifyContent='center' alignItems='center' w='100%' >
        <Flex direction='column' align='start' me='auto'>
          <Text color={textColor} fontSize='lg' me='6px' fontWeight='700'>
            User Account Access
          </Text>
          <Text fontSize='md' color={textColorSecondary}>
            Here you can block user account access.
          </Text>
        </Flex>
        <Button
          _hover={{ backgroundColor: "brand.400" }}
          px='24px'
          onClick={jwtAccountInfo?.isGuardianAdmin || jwtAccountInfo?.isAccountManagement ? handleUserAccessClick : null}
          fontSize='sm'
          fontWeight='700'
          backgroundColor={isUserAccess ? "green.500" : "red.500"}
          title={isUserAccess ? 'Click to block user' : 'Click to unblock user'}
        >
          {isUserAccess ? "AVAILABLE" : "BLOCKED"}
        </Button>
      </Flex>

    </Card>
  );
}
