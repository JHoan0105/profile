import React from 'react';

// chakra imports
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import Content from './components/Content';

// Assets
import { IoMenuOutline } from 'react-icons/io5';

function Sidebar(props) {
  const { routes, mini, hovered, setHovered } = props;
  // this is for the rest of the collapses
  let variantChange = '0.2s linear';
  let shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'unset',
  );
  // Chakra Color Mode
  let sidebarBg = useColorModeValue('guardianLight.100', 'guardianDark.200');
  let sidebarRadius = '30px';
  let sidebarMargins = '0px';
  // SIDEBAR
  return (
    <Box
      display={{ sm: 'none', xl: 'block' }}
      position="fixed"
      minH="100%"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w={
          mini === false
            ? '400px'
            : mini === true && hovered === true
              ? '400px'
              : '400px'
        }
        ms={{
          sm: '16px',
        }}
        my={{
          sm: '16px',
        }}
        h="calc(100vh - 32px)"
        m={sidebarMargins}
        borderRadius={sidebarRadius}
        minH="100%"
        overflowX="hidden"
        boxShadow={shadow}
      >
        <Content mini={mini} hovered={hovered} routes={routes} />
      </Box>
    </Box>
  );
}

// PROPS

export default Sidebar;
