/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.1.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo'

import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
// chakra imports
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  Text,
  List,
  Icon,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react';
// Assets
import { FaCircle } from 'react-icons/fa';

export function SidebarLinks(props) {
  //   Chakra color mode
  const accountInfo = getAccountInfo();
  let location = useLocation();
  let activeColor = useColorModeValue('black', 'white');
  let inactiveColor = useColorModeValue(
    'black',
    'white',
  );
  let activeIcon = 'guardianColor.100'

  const { routes, hovered, mini } = props;
  const defaultIndex = routes.map((_, index) => index);
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {

    return location.pathname.includes(routeName);
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    return routes.map((route, key) => {
      // Define a condition to include additional routes for development environment
      const isDevEnvironment = process.env.REACT_APP_DEV_COMPUTER === 'true';
      let isNodeProductionEnv = true;
      if (process.env.NODE_ENV !== "production") {
        isNodeProductionEnv = false;
      }

      if (
        // System Admin
        ((accountInfo?.isGuardianAdmin || accountInfo?.isAccountManagement) && (
          route.name === 'Administrator'
        ))
        || ((accountInfo?.isGuardianAdmin || accountInfo?.isAccountManagement) && (
          route.name === 'User'
        ))
        || ((accountInfo?.isGuardianAdmin || accountInfo?.isCertusProvisioning) && (
          route.name === 'Device Provisioning'
        ))
        || ((accountInfo?.isGuardianAdmin || accountInfo?.isAlertManagement) && (
          route.name === 'Alert Rules'
        ))
        ||
        ((accountInfo?.isGuardianAdmin) && (
          route.name === 'Account Numbers'
        ))
        || (accountInfo?.isGuardianAdmin && (
          route.name === 'Certus Data Service'
        ))
        || (accountInfo?.isGuardianAdmin && (
          route.name === 'Certus Voice Service'
        ))
        || (accountInfo?.isGuardianAdmin && (
          route.name === 'Service Plan'
        ))
        //All users
        || route.name === 'Main'
        || route.name === 'Dashboard'
        || route.name === 'Usages'
      ) {
        if (route.collapse) {

          return (
            <Accordion allowMultiple key={key} width="120%" defaultIndex={defaultIndex}>
              <AccordionItem maxW="75%" border="none" key={key}>
                <AccordionButton
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  _hover={{
                    bg: 'unset',
                  }}
                  _focus={{
                    boxShadow: 'none',
                  }}
                  borderRadius="8px"
                  w={{
                    sm: '100%',
                    xl: '100%',
                    '2xl': '95%',
                  }}
                  px={route.icon ? null : '0px'}
                  py="0px"
                  bg={'transparent'}
                  ms={0}
                >
                  {route.icon ? (
                    <Flex
                      align="center"
                      justifyContent={
                        mini === false
                          ? 'space-between'
                          : mini === true && hovered === true
                            ? 'space-between'
                            : 'center'
                      }
                      w="100%"
                    >
                      <HStack
                        mb="6px"
                        spacing={
                          activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                        }
                      >
                        <Flex
                          w="100%"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Box
                            color={
                              activeRoute(route.path.toLowerCase())
                                ? activeIcon
                                : inactiveColor
                            }
                            me={
                              mini === false
                                ? '12px'
                                : mini === true && hovered === true
                                  ? '12px'
                                  : '0px'
                            }
                            mt="6px"
                          >
                            {route.icon}
                          </Box>
                          <Text
                            display={
                              mini === false
                                ? 'block'
                                : mini === true && hovered === true
                                  ? 'block'
                                  : 'none'
                            }
                            me="auto"
                            color={
                              activeRoute(route.path.toLowerCase())
                                ? activeIcon
                                : activeColor
                            }
                            fontWeight="500"
                            fontSize="md"
                          >

                            {route.name}

                          </Text>
                        </Flex>
                      </HStack>
                      <AccordionIcon
                        display={
                          mini === false
                            ? 'block'
                            : mini === true && hovered === true
                              ? 'block'
                              : 'none'
                        }
                        ms="auto"
                        color={activeColor}
                        transform={route.icon ? null : 'translateX(-70%)'}
                      />
                    </Flex>
                  ) : (
                    <Flex
                      pt="0px"
                      pb="10px"
                      justify={'center'}
                      alignItems="center"
                      w="100%"
                    >
                      <HStack
                        spacing={
                          activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                        }
                        ps={
                          mini === false
                            ? '34px'
                            : mini === true && hovered === true
                              ? '34px'
                              : '0px'
                        }
                      >
                        <Text
                          me="auto"
                          color={
                            activeRoute(route.path.toLowerCase())
                              ? activeColor
                              : inactiveColor
                          }
                          fontWeight="500"
                          fontSize="sm"
                        >
                          {mini === false
                            ? route.name
                            : mini === true && hovered === true
                              ? route.name
                              : route.name[0]}
                        </Text>
                      </HStack>
                      <AccordionIcon
                        display={
                          mini === false
                            ? 'block'
                            : mini === true && hovered === true
                              ? 'block'
                              : 'none'
                        }
                        ms="auto"
                        color={'secondaryGray.600'}
                        transform={null}
                      />
                    </Flex>
                  )}
                </AccordionButton>

                <AccordionPanel
                  display={
                    mini === false
                      ? 'block'
                      : mini === true && hovered === true
                        ? 'block'
                        : 'flex'
                  }
                  justifyContent="center"
                  alignItems="center"
                  flexDirection={'column'}
                  pe={route.icon ? '14px !important' : '0px'}
                  py="0px"
                  ps={route.icon ? '14px !important' : '8px'}
                >
                  <List>
                    {
                      route.icon
                        ? createLinks(route.items) // for bullet accordion links

                        : createAccordionLinks(route.items.filter(subItem => subItem.name !== '')) // for non-bullet accordion links
                    }
                  </List>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          );
        } else {
          return (
            <NavLink to={route.layout + route.path} key={key}>
              {route.icon ? (
                <Flex
                  align="center"
                  justifyContent="space-between"
                  w="100%"
                  ps="17px"
                  mb="0px"
                >
                  <HStack
                    mb="6px"
                    spacing={
                      activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                    }
                  >
                    <Flex w="100%" alignItems="center" justifyContent="center">
                      <Box
                        color={
                          activeRoute(route.path.toLowerCase())
                            ? activeIcon
                            : inactiveColor
                        }
                        me="12px"
                        mt="6px"
                      >
                        {route.icon}
                      </Box>
                      <Text
                        me="auto"
                        color={
                          activeRoute(route.path.toLowerCase())
                            ? activeColor
                            : 'secondaryGray.600'
                        }
                        fontWeight="500"
                      >
                        {mini === false
                          ? route.name
                          : mini === true && hovered === true
                            ? route.name
                            : route.name[0]}
                      </Text>
                    </Flex>
                  </HStack>
                </Flex>
              ) : (
                <ListItem ms={null}>
                  <Flex
                    ps={
                      mini === false
                        ? '34px'
                        : mini === true && hovered === true
                          ? '34px'
                          : '0px'
                    }
                    alignItems="center"
                    mb="8px"
                  >
                    <Text
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : inactiveColor
                      }
                      fontWeight="500"
                      fontSize="sm"
                    >
                      {mini === false
                        ? route.name
                        : mini === true && hovered === true
                          ? route.name
                          : route.name[0]}
                    </Text>
                  </Flex>
                </ListItem>
              )}
            </NavLink>
          );
        }
      }
    });
  };
  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createAccordionLinks = (routes) => {
    return routes.map((route, key) => {
      return (
        <NavLink to={route.layout + route.path} key={key}>
          <ListItem
            ms={
              mini === false
                ? '28px'
                : mini === true && hovered === true
                  ? '28px'
                  : '0px'
            }
            display="flex"
            alignItems="center"
            mb="10px"
            key={key}
          >
            <Icon w="6px" h="6px" me="8px" as={FaCircle} color={activeIcon} />
            <Text
              color={
                activeRoute(route.path.toLowerCase())
                  ? activeColor
                  : inactiveColor
              }
              fontWeight={
                activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'
              }
              fontSize="sm"
            >
              {mini === false
                ? route.name
                : mini === true && hovered === true
                  ? route.name
                  : route.name[0]}
            </Text>
          </ListItem>
        </NavLink>
      );
    });
  };
  //  BRAND
  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
