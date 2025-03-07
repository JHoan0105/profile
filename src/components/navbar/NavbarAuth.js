import PropTypes from "prop-types";
import React from "react";
import { NavLink } from "react-router-dom";

// Chakra imports
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  Link,
  Menu,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
  useColorMode,
  useDisclosure,
  SimpleGrid,
} from "@chakra-ui/react";

// Custom components
import { HorizonLogo } from "components/icons/Icons";
import { SidebarResponsive } from "components/sidebar/Sidebar";
import { SidebarContext } from "contexts/SidebarContext";

// Assets
import dropdownMain from "assets/img/layout/dropdownMain.png";
import dropdown from "assets/img/layout/dropdown.png";
import { GoChevronDown } from "react-icons/go";
import routes from "routes.js";

export default function AuthNavbar(props) {
  const { logo, logoText, secondary, sidebarWidth, ...rest } = props;
  const { colorMode } = useColorMode();
  // Menu States
  const {
    isOpen: isOpenAuth,
    onOpen: onOpenAuth,
    onClose: onCloseAuth,
  } = useDisclosure();
  const {
    isOpen: isOpenDashboards,
    onOpen: onOpenDashboards,
    onClose: onCloseDashboards,
  } = useDisclosure();
  const {
    isOpen: isOpenMain,
    onOpen: onOpenMain,
    onClose: onCloseMain,
  } = useDisclosure();
  const {
    isOpen: isOpenNft,
    onOpen: onOpenNft,
    onClose: onCloseNft,
  } = useDisclosure();
  // Menus
  function getLinks(routeName) {
    let foundRoute = routes.filter(function (route) {
      return route.items && route.name === routeName;
    });
    console.log(foundRoute);
    return foundRoute[0].items;
  }
  function getLinksCollapse(routeName) {
    let foundRoute = routes.filter(function (route) {
      return route.items && route.name === routeName;
    });

    let foundLinks = foundRoute[0].items.filter(function (link) {
      return link.collapse === true;
    });

    return foundLinks;
  }
  let authObject = getLinksCollapse("Authentication");
  let mainObject = getLinksCollapse("Main Pages");
  let dashboardsObject = getLinks("Dashboards");
  let nftsObject = getLinks("NFTs");
  let logoColor = useColorModeValue("white", "white");
  // Chakra color mode

  const textColor = useColorModeValue("black", "white");
  let menuBg = useColorModeValue("black", "guardianDark.500");
  let mainText = "#fff";
  let navbarBg = "none";
  let navbarShadow = "initial";
  let bgButton = "white";
  let colorButton = "brand.500";
  let navbarPosition = "absolute";

  let brand = (
    <Link
      href={`${process.env.PUBLIC_URL}/#/`}
      target='_blank'
      display='flex'
      lineHeight='100%'
      fontWeight='bold'
      justifyContent='center'
      alignItems='center'
      color={mainText}>
      <Text fontsize='3xl' mt='3px'>
        Guardian Mobility
      </Text>
    </Link>
  );
  if (props.secondary === true) {
    brand = (
      <Link
        minW='175px'
        href={`${process.env.PUBLIC_URL}/#/`}
        target='_blank'
        display='flex'
        lineHeight='100%'
        fontWeight='bold'
        justifyContent='center'
        alignItems='center'
        color={mainText}>
        <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} />
      </Link>
    );
    // mainText = useColorModeValue("gray.700", "gray.200");
    // navbarBg = useColorModeValue("white", "guardianDark.200");
    // navbarShadow = useColorModeValue(
    //   "0px 7px 23px rgba(0, 0, 0, 0.05)",
    //   "none"
    // );
    // bgButton = useColorModeValue("gray.700", "white");
    // colorButton = useColorModeValue("white", "gray.700");
    // navbarPosition = "fixed";
  }
  const createNftsLinks = (routes) => {
    return routes.map((link, key) => {
      return (
        <NavLink
          key={key}
          to={link.layout + link.path}
          style={{ maxWidth: "max-content" }}>
          <Text color='gray.400' fontSize='sm' fontWeight='500'>
            {link.name}
          </Text>
        </NavLink>
      );
    });
  };
  const createDashboardsLinks = (routes) => {
    return routes.map((link, key) => {
      return (
        <NavLink
          key={key}
          to={link.layout + link.path}
          style={{ maxWidth: "max-content" }}>
          <Text color='gray.400' fontSize='sm' fontWeight='500'>
            {link.name}
          </Text>
        </NavLink>
      );
    });
  };
  const createMainLinks = (routes) => {
    return routes.map((link, key) => {
      if (link.collapse === true) {
        return (
          <Stack key={key} direction='column' maxW='max-content'>
            <Stack
              direction='row'
              spacing='0px'
              align='center'
              cursor='default'>
              <Text
                textTransform='uppercase'
                fontWeight='bold'
                fontSize='sm'
                me='auto'
                color={textColor}>
                {link.name}
              </Text>
            </Stack>
            <Stack direction='column' bg={menuBg}>
              {createMainLinks(link.items)}
            </Stack>
          </Stack>
        );
      } else {
        return (
          <NavLink key={key} to={link.layout + link.path}>
            <Text color='gray.400' fontSize='sm' fontWeight='normal'>
              {link.name}
            </Text>
          </NavLink>
        );
      }
    });
  };
  const createAuthLinks = (routes) => {
    return routes.map((link, key) => {
      if (link.collapse === true) {
        return (
          <Stack key={key} direction='column' maxW='max-content'>
            <Stack
              direction='row'
              spacing='0px'
              align='center'
              cursor='default'>
              <Text
                textTransform='uppercase'
                fontWeight='bold'
                fontSize='sm'
                me='auto'
                color={textColor}>
                {link.name}
              </Text>
            </Stack>
            <Stack direction='column' bg={menuBg}>
              {createAuthLinks(link.items)}
            </Stack>
          </Stack>
        );
      } else {
        return (
          <NavLink key={key} to={link.layout + link.path}>
            <Text color='gray.400' fontSize='sm' fontWeight='normal'>
              {link.name}
            </Text>
          </NavLink>
        );
      }
    });
  };
  const linksAuth = (
    <HStack display={{ sm: "none", lg: "flex" }} spacing='20px'>
      <Stack
        direction='row'
        spacing='4px'
        align='center'
        color='#fff'
        fontWeight='bold'
        onMouseEnter={onOpenDashboards}
        onMouseLeave={onCloseDashboards}
        cursor='pointer'
        position='relative'>
        <Text fontSize='sm' color={mainText}>
          Dashboards
        </Text>
        <Box>
          <Icon
            mt='8px'
            as={GoChevronDown}
            color={mainText}
            w='14px'
            h='14px'
            fontWeight='2000'
          />
        </Box>
        <Menu isOpen={isOpenDashboards}>
          <MenuList
            bg={menuBg}
            p='22px'
            cursor='default'
            borderRadius='15px'
            position='absolute'
            w='max-content'
            top='30px'
            left='-10px'
            display='flex'>
            <SimpleGrid columns='1' gap='8px' w='150px'>
              {createDashboardsLinks(dashboardsObject)}
            </SimpleGrid>
            <Image w='110px' h='110px' borderRadius='16px' src={dropdown} />
          </MenuList>
        </Menu>
      </Stack>
      <Stack
        direction='row'
        spacing='4px'
        align='center'
        color='#fff'
        fontWeight='bold'
        onMouseEnter={onOpenNft}
        onMouseLeave={onCloseNft}
        cursor='pointer'
        position='relative'>
        <Text fontSize='sm' color={mainText}>
          NFTs
        </Text>
        <Box>
          <Icon
            mt='8px'
            as={GoChevronDown}
            color={mainText}
            w='14px'
            h='14px'
            fontWeight='2000'
          />
        </Box>
        <Menu isOpen={isOpenNft}>
          <MenuList
            bg={menuBg}
            p='22px'
            cursor='default'
            borderRadius='15px'
            position='absolute'
            w='max-content'
            top='30px'
            left='-10px'
            display='flex'>
            <SimpleGrid columns='1' gap='8px' w='150px'>
              {createNftsLinks(nftsObject)}
            </SimpleGrid>
            <Image w='110px' h='110px' borderRadius='16px' src={dropdown} />
          </MenuList>
        </Menu>
      </Stack>
      <Stack
        direction='row'
        spacing='4px'
        align='center'
        color='#fff'
        fontWeight='bold'
        onMouseEnter={onOpenMain}
        onMouseLeave={onCloseMain}
        cursor='pointer'
        position='relative'>
        <Text fontSize='sm' color={mainText}>
          Main Pages
        </Text>
        <Box>
          <Icon
            mt='8px'
            as={GoChevronDown}
            color={mainText}
            w='14px'
            h='14px'
            fontWeight='2000'
          />
        </Box>
        <Menu isOpen={isOpenMain}>
          <MenuList
            bg={menuBg}
            p='18px'
            ps='24px'
            cursor='default'
            borderRadius='15px'
            position='absolute'
            w='max-content'
            top='30px'
            left='-10px'
            display='flex'>
            <SimpleGrid
              me='50px'
              columns='2'
              align='start'
              minW='280px'
              gap='24px'>
              {createMainLinks(mainObject)}
            </SimpleGrid>
            <Image borderRadius='16px' src={dropdownMain} />
          </MenuList>
        </Menu>
      </Stack>
      <Stack
        direction='row'
        spacing='4px'
        align='center'
        color='#fff'
        fontWeight='bold'
        onMouseEnter={onOpenAuth}
        onMouseLeave={onCloseAuth}
        cursor='pointer'
        position='relative'>
        <Text fontSize='sm' color={mainText}>
          Authentications
        </Text>
        <Box>
          <Icon
            mt='8px'
            as={GoChevronDown}
            color={mainText}
            w='14px'
            h='14px'
            fontWeight='2000'
          />
        </Box>
        <Menu isOpen={isOpenAuth}>
          <MenuList
            bg={menuBg}
            p='22px'
            cursor='default'
            borderRadius='15px'
            position='absolute'
            top='30px'
            left='-10px'
            display='flex'
            w='max-content'>
            <SimpleGrid
              me='20px'
              columns='2'
              align='start'
              minW='180px'
              gap='24px'>
              {createAuthLinks(authObject)}
            </SimpleGrid>
            <Image borderRadius='16px' src={dropdown} />
          </MenuList>
        </Menu>
      </Stack>
    </HStack>
  );

  return (
    <SidebarContext.Provider value={{ sidebarWidth }}>
      <Flex
        position={navbarPosition}
        top='16px'
        left='50%'
        transform='translate(-50%, 0px)'
        background={navbarBg}
        boxShadow={navbarShadow}
        borderRadius='15px'
        px='16px'
        py='22px'
        mx='auto'
        width='1044px'
        maxW='90%'
        alignItems='center'
        zIndex='3'>
        <Flex w='100%' justifyContent={{ sm: "start", lg: "space-between" }}>
          {brand}
          <Box
            ms={{ base: "auto", lg: "0px" }}
            display={{ base: "flex", lg: "none" }}
            justifyContent='center'
            alignItems='center'>
            <SidebarResponsive
              logo={
                <Stack
                  direction='row'
                  spacing='12px'
                  align='center'
                  justify='center'>
                  <Box
                    w='1px'
                    h='20px'
                    bg={colorMode === "dark" ? "white" : "gray.700"}
                  />
                </Stack>
              }
              logoText={props.logoText}
              secondary={props.secondary}
              routes={routes}
              {...rest}
            />
          </Box>
          {linksAuth}
        </Flex>
      </Flex>
    </SidebarContext.Provider>
  );
}

AuthNavbar.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  brandText: PropTypes.string,
};
