/*
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';
import getDevices from 'services/device/getDevices'
import { AuthContext } from 'contexts/AuthContext';

// Chakra imports
import { Flex, Box, Text, useColorModeValue, useTheme } from '@chakra-ui/react';
import React, { useEffect, useState, useContext } from "react";

import {
  buildStyles,
  CircularProgressbarWithChildren,
} from 'react-circular-progressbar';

// Custom components
import Card from 'components/card/Card';

export default function ProfitEstimation(props) {
  const { ...rest } = props;
  const [numberActiveDevice, setNumberActiveDevice] = useState(0);
  const { accountInfo } = useContext(AuthContext);
  accountInfo.current = getAccountInfo();
  const currentAccountNumber = localStorage?.getItem('accountNumber') || accountInfo.accountNumber;
  
  useEffect(() => {
    (async () => {
      const devices = await getDevices(currentAccountNumber);
      console.log("deviceList", devices);
      const activeDevices = devices ? devices.filter(device => device.active === true) : [];
      setNumberActiveDevice(activeDevices.length);    
    })();
  }, [currentAccountNumber]);

  // Chakra Color Mode
  const textColorMode = useColorModeValue('secondaryGray.900', 'white');
  const theme = useTheme();
  const textColor = textColorMode.includes('.')
    ? theme.colors[textColorMode.split('.')[0]][textColorMode.split('.')[1]]
    : textColorMode;

  return (
    <Card
      p="20px"
      alignItems="center"
      flexDirection="column"
      textAlign="center"
      w="100%"
      {...rest}
    >
      <Text
        color={textColor}
        fontSize="lg"
        fontWeight="700"
        mb="10px"
        mx="auto"
      >
        Active Device
      </Text>
      <Flex
        justifyContent="center"
        alignItems="center"
        w="100%"
        px="10px"
        mb="8px"
      />
      <Box w="100px" mx="auto" mb="10px" mt="10px">
        <CircularProgressbarWithChildren
          value='100'
          text={`${numberActiveDevice}`}
          styles={buildStyles({
            pathColor: '#F26539', // Color of the progress path
            textColor: textColor, // Color of the text inside the progress bar
            trailColor: '#D3D3D3', // Color of the trail (the part not yet filled)
            backgroundColor: '#FFFFFF', // Background color
          })}
        >
        </CircularProgressbarWithChildren>
      </Box>
    </Card>
  );
}
