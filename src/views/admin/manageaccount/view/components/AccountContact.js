/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.1.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports

// Chakra imports
import {
  Flex,
  FormControl,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import InputField from "components/fields/InputField";
import React from "react";

// Default function
export default function Information({ accountInfo }) {
  // Get the URL search parameters
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  // Chakra Color Mode
  return (
    <FormControl >
      <Card mt='0px' mb='20px'>
        <Flex direction='column' mb='30px' ms='10px'>
          <Text fontSize='xl' color={textColorPrimary} fontWeight='bold'>
            Account Contact Information
          </Text>
        </Flex>
        <SimpleGrid
          columns={{ sm: 2, md: 2 }}
          spacing={{ base: "20px", xl: "20px" }}
          justify='space-between'
          mb='20px'
        >
          <InputField
            me='30px'
            id='account'
            label='Account Number'
            mb='0px'
            placeholder={ 'account number'}
            value={!!accountInfo?.accountNumber ? accountInfo?.accountNumber : ''}
            readOnly
          />
          <InputField
            me='30px'
            id='accountName'
            label='Account Name'
            mb='0px'
            placeholder={ 'account name'}
            value={!!accountInfo?.accountName ? accountInfo?.accountName : ''}
            readOnly
            />
        </SimpleGrid>
      </Card>
    </FormControl>
  );
}
