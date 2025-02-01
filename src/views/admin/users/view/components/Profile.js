/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports

// Chakra imports
import { Flex, Text, Avatar, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React from "react";

// Default function
export default function Profile({ accountInfo }) {
  const textColorPrimary = useColorModeValue("black", "white");
  const textColorSecondary = useColorModeValue("black", "white");
  // Chakra Color Mode
  return (
    <Card mb='20px'>
      <Flex align='center'>
        <Avatar color="white" name={accountInfo.firstName + " " + accountInfo.lastName} bg="#F26539" size="xl" h='85px' w='85px' me='20px' />
        <Flex direction='column'>
          <Text color={textColorPrimary} fontWeight='bold' fontSize='2xl'>
            {accountInfo.firstName + " " + accountInfo.lastName}
          </Text>
          <Text mt='1px' color={textColorSecondary} fontSize='sm'>
            {accountInfo.accountName}
          </Text>
          <Text mt='1px' color={textColorSecondary} fontSize='sm'>
            {accountInfo.type}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}
