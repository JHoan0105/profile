/*
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import coffeeTime from 'assets/img/coffeeTime.png';

// Chakra imports
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

// Custom components
import { HelpIcon, GiftIcon } from 'components/icons/Icons';
import { HSeparator } from 'components/separator/Separator';
const appName = 'Service Management'
const appABR = 'WS'
const appVersion = process.env.REACT_APP_VERSION

export function SidebarBrand(props) {
  const { mini, hovered } = props;
  //   Chakra color mode
  const textColor = useColorModeValue("black", "white");

  return (
    <Flex alignItems="center" flexDirection="column">
      <Flex mb='10px'>
        <img src={coffeeTime} style={{ 'width': '100px', 'height': '100px' }} alt="Guardian Mobility"></img>
      </Flex>
      <Flex>
        <Text
          fontSize={'30px'}
          fontWeight="800"
          color={textColor}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {appABR}
        </Text>
        <Text
          alignContent='center'
          fontSize={'xs'}
          fontWeight="100"
          style={{ fontFamily: 'normal' }}
          color={textColor}
        >
          &nbsp;&nbsp;{appVersion}
        </Text>
      </Flex>
      <Text
        fontSize={'xs'}
        fontWeight="300"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        color={textColor}
      >
        {appName}
      </Text>
      <HSeparator mb="20px" />

    </Flex>
  );
}

export default SidebarBrand;
