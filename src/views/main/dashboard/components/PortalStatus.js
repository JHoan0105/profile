/*
=========================================================
* Provisioning Portal - v2.0.2
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

import { Text, Box, Icon, useColorModeValue } from "@chakra-ui/react";
// Assets

// Custom components
import Card from "components/card/Card.js";
import React from "react";
import { MdCheckCircle, MdCancel, MdOutlineError } from 'react-icons/md';
import { VSeparator } from "components/separator/Separator";
export default function PortalStatus({ activeDevice, certusCallout, gDatabase, ...props }) {
  const { ...rest } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const certus = certusCallout ? 'Approved' : "Disable"
  const guardian = activeDevice ? 'Approved' : "Disable"
  const database = gDatabase ? 'Approved' : "Disable"

  return (
    <Card
      flexDirection='row'
      pb='0px'
      mb='0px'
      {...rest}>
      <Text
      pr='20px'
        mb='20px'
        textAlign='center'
        color={textColor}
        fontSize='xl'
        fontWeight='1000'>
        Service Status
      </Text>
      <VSeparator mb='15px' />
      <Box justify='space-between' align='center' w='100%' >
        <Text
          mt='10px'
          textAlign='center'
          color={textColor}
          fontSize='sm'
          fontWeight='500'>
          Guardian Satellite API
        </Text>
        <Icon
          w="24px"
          h="24px"
          me="5px"
          color={
            certus === 'Approved'
              ? 'green.500'
              : certus === 'Disable'
                ? 'red.500'
                : certus === 'Error'
                  ? 'orange.500'
                  : null
          }
          as={
            certus === 'Approved'
              ? MdCheckCircle
              : certus === 'Disable'
                ? MdCancel
                : certus === 'Error'
                  ? MdOutlineError
                  : null
          }
        />
      </Box>
      <Box justify='space-between' align='center' w='100%' >
        <Text
          pl='20px'
          mt='10px'
          textAlign='center'
          color={textColor}
          fontSize='sm'
          fontWeight='500'>
          Guardian Database API
        </Text>
        <Icon
          w="24px"
          h="24px"
          me="5px"
          color={
            database === 'Approved'
              ? 'green.500'
              : database === 'Disable'
                ? 'red.500'
                : database === 'Error'
                  ? 'orange.500'
                  : null
          }
          as={
            database === 'Approved'
              ? MdCheckCircle
              : database === 'Disable'
                ? MdCancel
                : database === 'Error'
                  ? MdOutlineError
                  : null
          }
        />
      </Box>
      <Box justify='space-between' align='center' w='100%' >
        <Text
          pl='20px'
          mt='10px'
          textAlign='center'
          color={textColor}
          fontSize='sm'
          fontWeight='500'>
          Guardian Provisioning API
        </Text>
        <Icon
          w="24px"
          h="24px"
          me="5px"
          color={
            guardian === 'Approved'
              ? 'green.500'
              : guardian === 'Disable'
                ? 'red.500'
                : guardian === 'Error'
                  ? 'orange.500'
                  : null
          }
          as={
            guardian === 'Approved'
              ? MdCheckCircle
              : guardian === 'Disable'
                ? MdCancel
                : guardian === 'Error'
                  ? MdOutlineError
                  : null
          }
        />
        </Box>

    </Card>
  );
}
