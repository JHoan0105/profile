/*
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import profilePic from 'assets/img/profilePic.png'

// Chakra imports
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';

// Custom components
import { HSeparator } from 'components/separator/Separator';

export function SidebarBrand(props) {
  const { mini, hovered } = props;
  //   Chakra color mode
  const textColor = useColorModeValue("black", "white");

  return (
    <Flex alignItems="center" flexDirection="column">
      <Box mb='10px' display="flex" flexDirection="column" alignItems="center">
        <img src={profilePic} style={{ 'width': '100px', 'height': '100px' }} alt="picture"></img>
        <Flex >
          <Text
          fontSize={'20px'}
          fontWeight="800"
          color={textColor}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {'John Hoang'}
          </Text>
        </Flex>
        <Text
          fontSize={'xs'}
          fontWeight="300"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          color={textColor}
        >
          Hoan0105@Algonquinlive.com
        </Text>
        <Text
          fontSize={'xs'}
          fontWeight="300"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          color={textColor}
        >
        </Text>
        <Text
          fontSize={'xs'}
          fontWeight="300"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          color={textColor}
        >
          https://github.com/JHoan0105
        </Text>
        <Text
          fontSize={'xs'}
          fontWeight="300"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          color={textColor}
        >
          Ottawa, Ontario
        </Text>
        <Text
          fontSize={'xs'}
          fontWeight="300"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          color={textColor}
        >
          (613) 852-4892
        </Text>
      </Box>
      <Flex>
      </Flex>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
