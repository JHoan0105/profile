/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.1.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo'
// chakra imports
import {
  Avatar,
  Box,
  Flex,
  Stack,
  Text,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
//   Custom components
import Brand from './Brand';
import Links from './Links';

import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { GiFlowerTwirl } from "react-icons/gi";

// FUNCTIONS
function SidebarContent(props) {
  const { routes, mini, hovered } = props;
  const textColor = useColorModeValue('black', 'white');

  const accountInfo = getAccountInfo();
  const nav = useNavigate();

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("black", "white");
  const optionsBackGroundColor = useColorModeValue('white', `grey`);

  // Effect to fetch account numbers
  useEffect(() => {

  }, []);

  useEffect(() => {
  })

  // Function to handle changing the selected account number
  const handleAccountNumberChange = (event) => {
    const newAccountNumber = event.target.value;
    console.log("newAccountNumber: ", newAccountNumber)
    setCurrentAccountNumber(newAccountNumber);

    localStorage.setItem('accountNumber', newAccountNumber); // Update localStorage when the user selects a new number
    console.log(" localStorage.setItem(accountNumber: ", newAccountNumber);
    setTimeout(() => {
      const currentPage = window.location.href.split('?')[0]; // Get path part only
      console.log("currentPage: ", currentPage);

      // Define mappings from current pages to target pages
      const pageMappings = {
        '/profile': '/profile',
        '/admin/manageaccount/view': '/admin/manageaccount/list',
        '/admin/dataservice/view': '/admin/dataservice/list',
        '/admin/alertrules/view': '/admin/alertrules/list',
        '/admin/devices/view': '/admin/devices',
        '/admin/devices/create': '/admin/devices',
        '/admin/users/view': '/admin/users/list',
        '/admin/serviceplan/view': '/admin/serviceplan/list/',
        '/admin/users/createNewUser': '/admin/users/list',
      };

      // Check if the current page matches any of the mappings
      let redirectTo = null;
      Object.keys(pageMappings).forEach(key => {
        if (currentPage.includes(key)) {
          redirectTo = currentPage.replace(key, pageMappings[key]);
        }
      });

      if (redirectTo) {
        console.log("Redirecting to:", redirectTo);
        window.location.href = redirectTo;
      } else {
        console.log("No matching page mapping found.");
        // Handle the case where no mapping was found (optional)
        window.location.reload();
      }
    }, 500)


  };
  // SIDEBAR
  return (
    <Flex direction="column" height="100%" pt="25px" borderRadius="30px">
      {/*Top Icon?*/}
      <Brand mini={mini} hovered={hovered} />
      <Stack direction="column" mb="auto" ml='20px'>
        { /*resume items*/}
        <Flex >
          <Text
            fontSize={'20px'}
            fontWeight="800"
            color={textColor}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {'Profile'}
          </Text>
          <Text ml='10px'>
            An analytical, adaptable, and team-oriented individual with qualified-educational
            experience contributing to computer programming, data structures and computer
            architecture.
          </Text>
        </Flex>
        {/*<GiFlowerTwirl />*/}
        <Flex align="center" justify="center" direction="row">
          <GiFlowerTwirl style={{ fontSize: '30px' }} />
          <Text ml='10px'>
            Proficient communication and liaising abilities (both working independently and as part of
            teams).
          </Text>
        </Flex>
        <Flex align="center" justify="center" direction="row">
          <GiFlowerTwirl style={{ fontSize: '50px' }} />
          <Text ml='10px'>
            Proven ability to drive and maintain positive working relationships with clients, colleagues, superiors, and other professionals while working in a
            fast-paced, detail-oriented environment.
          </Text>
        </Flex>
        <Flex mt='10px'>
          <Text
            fontSize={'20px'}
            fontWeight="800"
            color={textColor}
          >
            {'Languages'}
          </Text>
        </Flex>
        <Text ml='10px'>
          ASM assembler, Bash, Batch, Python, HTML, JavaScript, React, Typescript,
          JSON, PHP, SQL, Java, XAML, C++, C#, and C programming
        </Text>
        <Flex mt='10px'>
          <Text
            fontSize={'20px'}
            fontWeight="800"
            color={textColor}
          >
            {'Tools'}
          </Text>
        </Flex>
        <Text ml='10px'>
          MS Excel, Weka, RapidMiner, RStudio, MariaDb,
          DBeaver, HeidiSQL, Eclipse, Xamarin, .NET, NetBeans, Visual Studio, Jakarta EE, QNX
          Neutrino RTOS/Momentics IDE, Arduino IDE, Node-RED, Swagger,
          React.js, Node.js, Postman, Trello, Jira, GitHub, Git Bash.
        </Text>
      </Stack>
      {/*Empty Box?*/}
      <Box
        ps="20px"
        pe={{ md: '16px', '2xl': '16px' }}
        mt="60px"
        borderRadius="30px"
      >
      </Box>

    </Flex>
  );
}

export default SidebarContent;
