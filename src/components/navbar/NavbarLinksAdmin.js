// Chakra Imports
import { useNavigate, NavLink } from 'react-router-dom';
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom Components
import { SidebarResponsive } from 'components/sidebar/Sidebar';
// Assets
import { MdInfoOutline } from 'react-icons/md';

import Configurator from 'components/navbar/Configurator';
import routes from 'routes';
import { useEffect } from 'react';

//Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';

export default function HeaderLinks(props) {
  const { secondary, theme, setTheme } = props;
  const accountInfo = getAccountInfo();
  const nav = useNavigate();
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('black', 'white');
  let menuBg = useColorModeValue('white', 'guardianDark.200');
  const textColor = useColorModeValue('black', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );
  const borderButton = useColorModeValue('secondaryGray.1000', 'whiteAlpha.200');
  const hoverColor = useColorModeValue('gray.300', 'gray.700');

  const logOut = () => {
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    sessionStorage.clear();
  }
  const profileSettings = () => {

  }
  //JWT expired
  useEffect(() => {
    // Check if accountInfo is not available and navigate to '/auth'
    if (!accountInfo) {
      nav('/auth');
    }
  }, []); // Empty dependency array means this effect runs only once after initial render

  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="999px"
      boxShadow={shadow}
    >
      <SidebarResponsive routes={routes} />

      <Menu>
        <MenuButton p="0px">
          <Icon
            mt="6px"
            as={MdInfoOutline}
            color={navbarIcon}
            w="18px"
            h="18px"
            me="10px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="20px"
          me={{ base: '30px', md: 'unset' }}
          borderRadius="20px"
          bg={menuBg}
          border="none"
          mt="22px"
          minW={{ base: 'unset' }}
          maxW={{ base: '360px', md: 'unset' }}
        >
          <Flex flexDirection="column">
            <Link w="100%" href="https://www.guardianmobility.com/">
              <Button w="100%" h="44px" mb="10px" variant="brand">
                Guardian Mobility
              </Button>
            </Link>
            <Link w="100%" href="/main/release">
              <Button w="100%" h="44px" mb="10px" bg="transparent" border="1px solid">
                Release Notes
              </Button>
            </Link>
            <Link
              w="100%"
              href="https://www.guardianmobility.com/contact/"
            >
              <Button
                w="100%"
                h="44px"
                mb="10px"
                border="1px solid"
                bg="transparent"
                borderColor={borderButton}
              >
                See Documentation
              </Button>
            </Link>
          </Flex>
        </MenuList>
      </Menu>
      <Configurator
        mini={props.mini}
        setMini={props.setMini}
        theme={theme}
        setTheme={setTheme}
      />
      <Menu>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: 'pointer' }}
            color="white"
            name={(accountInfo?.firstName ?? "") + " " + (accountInfo?.lastName ?? "")}
            bg="#F26539"
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; Hey, {accountInfo?.firstName && accountInfo?.lastName ? accountInfo.firstName + ' ' + accountInfo.lastName : ''}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <NavLink to="users/view">
              <MenuItem
                _hover={{ bg: hoverColor }}
                bg="none"
                borderRadius="8px"
                px="14px"
              >
                <Text fontSize="sm" onClick={profileSettings}>Profile Settings</Text>
              </MenuItem>
            </NavLink>
            <NavLink to="/auth">
              <MenuItem
                _hover={{ bg: hoverColor }}
                bg="none"
                color="red.400"
                borderRadius="8px"
                px="14px"
              >
                <Text fontSize="sm" onClick={logOut}>Log out</Text>
              </MenuItem>
            </NavLink>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}
