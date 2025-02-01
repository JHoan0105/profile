//=========================================================
// Provisioning Portal - v1.0.0
//=========================================================
// Copyright © 2024 Guardian Mobility All Rights Reserved
//=========================================================

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';

// Chakra imports
import {
  Box,
  Button,
  extendTheme,
  Flex,
  Text,
  useToast,
  Radio,
  SimpleGrid,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FaCircle } from 'react-icons/fa'; // Import the icons

// Custom components
import InputField from "components/fields/InputField";

// Default function
export default function UsagesData(props) {
  const { rowData } = props;
 
  // Chakra Color Mode
  return (
    <Card mb='-70px'>
      <Flex direction='column'>
        {/* Identifier and Model */}
        <SimpleGrid
          mb='0px'
          columns={{ sm: 1, md: 2 }}
          spacing={{ base: "20px", xl: "20px" }}>
          <InputField
            id='threshold1'
            label='Identifier'
            placeholder='0'
            value='A100'
          />
          <InputField
            id='model'
            label='Model'
            placeholder='0'
            value='G6'
          />
        </SimpleGrid>
        {/* IMEI */}
        <SimpleGrid
          mb='0px'
          columns={{ sm: 1, md: 2 }}
          spacing={{ base: "20px", xl: "20px" }}>
          <InputField
            id='imei'
            label='IMEI'
            placeholder='0'
            value='300058060209780'
          />
        </SimpleGrid>
        {/* Thresholds */}
        <SimpleGrid
          mb='0px'
          columns={{ sm: 1, md: 2 }}
          spacing={{ base: "20px", xl: "20px" }}>
          <InputField
            id='thresholdOne'
            label='Threshold 1'
            placeholder='0'
            value='10MB'
          />
          <InputField
            id='thresholdTwo'
            label='Threshold 2'
            placeholder='0'
            value='20MB'
          />
        </SimpleGrid>
        {/* Current Month Usage */}
        <SimpleGrid
          mb='0px'
          columns={{ sm: 1, md: 2 }}
          spacing={{ base: "20px", xl: "20px" }}>
          <InputField
            id='currentMonthUsage'
            label='Current Month Usage'
            placeholder='0'
            value='15MB'
          />
          <Box display="grid" gridTemplateColumns="5% 2% 5% 88%" alignItems="center" gap="15px">
            <Box backgroundColor="red" height="25px" width="10px">
              <Text fontSize="md" fontWeight="500"></Text>
            </Box>
            <Box backgroundColor="green" height="25px" width="10px" >
              <Text fontSize="md" fontWeight="500"></Text>
            </Box>
          </Box>
        </SimpleGrid>
        {/* Previous Month Usage */}
        <SimpleGrid
          mb='0px'
          columns={{ sm: 1, md: 2 }}
          spacing={{ base: "20px", xl: "20px" }}>
          <InputField
            id='previousMonthUsage'
            label='Previous Month Usage'
            placeholder='0'
            value='24MB'
          />
          <Box display="grid" gridTemplateColumns="5% 2% 5% 88%" alignItems="center" gap="15px">
            <Box backgroundColor="red" height="25px" width="10px">
              <Text fontSize="md" fontWeight="500"></Text>
            </Box>
            <Box backgroundColor="red" height="25px" width="10px" >
              <Text fontSize="md" fontWeight="500"></Text>
            </Box>
          </Box>
        </SimpleGrid>
      </Flex>
    </Card>
  );
}

