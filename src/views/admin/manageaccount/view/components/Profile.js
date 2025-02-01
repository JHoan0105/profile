/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
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
export default function Profile({ accountName, accountNumber }) {
  const textColorPrimary = useColorModeValue("black", "white");

  // Chakra Color Mode
  return (
    <Card mb='20px'>
      <Flex align='center'>
        <Avatar color="white" name={accountName} bg="#F26539" size="xl" h='85px' w='85px' me='20px' />
        <Flex direction='column'>
          <Text color={textColorPrimary} fontWeight='bold' fontSize='2xl'>
            {accountName}
          </Text>
          <Text color={textColorPrimary} fontWeight='none' fontSize='lg'>
            {accountNumber}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}
