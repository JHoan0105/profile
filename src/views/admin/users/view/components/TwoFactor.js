/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountInfo from 'services/getAccountInfo';

// Chakra imports
import {
  Flex,
  FormControl,
  SimpleGrid,
  Text,
  useColorModeValue,
  Button
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React from "react";

// Default function
export default function TwoFactor(props) {
  const { ...rest } = props;
  const accountInfo = getAccountInfo();
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  // Chakra Color Mode
  return (
    <FormControl>
      <Card p='30px' {...rest}>
        <Flex justify='space-between' align='center'>
          <Text fontSize='2xl' color={textColorPrimary} fontWeight='bold'>
            Two-Factor Authentication
          </Text>
          <Button
            variant='action'
            px='24px'
            onClick={() => console.log("hello")}
            fontSize='sm'
            fontWeight='700'
            backgroundColor={accountInfo.is2FactorEnabled ? "green.500" : "red.500"}>
            {accountInfo.is2FactorEnabled ? "ENABLED " : "DISABLED"}
          </Button>
        </Flex>
        <SimpleGrid
          columns={{ sm: 1, md: 1, xl: 1 }}
          spacing={{ base: "20px", xl: "0px" }}>
        </SimpleGrid>
      </Card>
    </FormControl>
  );
}
