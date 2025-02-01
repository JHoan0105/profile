/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.1.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo'
import getAccountNumberList from 'services/account/getAccountNumberList'

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
import Brand from 'components/sidebar/components/Brand';
import Links from 'components/sidebar/components/Links';

import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

// FUNCTIONS
function SidebarContent(props) {
  const { routes, mini, hovered } = props;
  const textColor = useColorModeValue('black', 'white');

  const accountInfo = getAccountInfo();
  const nav = useNavigate();

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("black", "white");
  const optionsBackGroundColor = useColorModeValue('white', `grey`);

  // Initial account number from localStorage or use 0 as a default
  let initialAccountNumber = localStorage?.getItem('accountNumber') || accountInfo.accountNumber;
  console.log("content.js/localStorage?.getItem('accountNumber'): ", localStorage?.getItem('accountNumber'));
  console.log("content.js/accountInfo.accountNumber: ", accountInfo.accountNumber);
  console.log("content.js/initialAccountNumber: ", initialAccountNumber);

  // Check if initialAccountNumber is not equal to accountInfo.accountNumber
  // or not part of accountInfo.accountNumbers array
  if (!accountInfo.isGuardianAdmin) {
    if (initialAccountNumber !== accountInfo.accountNumber && !accountInfo.accountNumbers?.some(account => account.account_number === initialAccountNumber)) {
      initialAccountNumber = accountInfo.accountNumber;
      localStorage.setItem('accountNumber', accountInfo.accountNumber);
      console.log(" localStorage.setItem(accountNumber: ", accountInfo.accountNumber);
      console.log("initialAccountNumber 2: ", initialAccountNumber);
    }
  }
  console.log("initialAccountNumber 3: ", initialAccountNumber);

  // This handle a case when guardian admin change the account number of a none guardian admin user
  if (!accountInfo.isGuardianAdmin && accountInfo.accountNumbers == null) {
    //&& accountInfo && accountInfo.accountNumbers == null
    // Should always be the jwt account number
    initialAccountNumber = accountInfo.accountNumber;
    localStorage.setItem('accountNumber', accountInfo.accountNumber);
    console.log(" localStorage.setItem(accountNumber: ", accountInfo.accountNumber);
  }

  // State for current account number
  const [currentAccountNumber, setCurrentAccountNumber] = useState(initialAccountNumber);
  // State for the list of account numbers
  const [accountNumberList, setAccountNumberList] = useState([]);

  // Effect to fetch account numbers
  useEffect(() => {

    const fetchData = async () => {
      try {
        // on v2.1.0 no longer using getAccountNumberList.
        const accountNumbers = accountInfo.isGuardianAdmin ? accountInfo?.accountNumbers : await getAccountNumberList() || [];
        console.log("accountNumbers: ", accountInfo?.email, accountNumbers);
        setAccountNumberList(accountNumbers);
        // Check if initialAccountNumber exists in the accountNumberList
        console.log("content.js/localStorage?.getItem('accountNumber'): ", localStorage?.getItem('accountNumber'));
        // Above: No longer using accountnumber list

        if (!accountInfo?.isGuardianAdmin && (!localStorage?.getItem('accountNumber') || !accountInfo?.accountNumbers?.some(obj => obj?.account_number === localStorage.getItem('accountNumber')))) {
          // If not, set initialAccountNumber to the first record in accountNumberList
          //localStorage.setItem('accountNumber', accountNumbers[0]?.accountNumber);
          console.log(" localStorage.setItem(accountNumber: ", accountNumbers[0]?.accountNumber);
          //setCurrentAccountNumber(accountNumbers[0]?.accountNumber);
        } else {
          setCurrentAccountNumber(localStorage.getItem('accountNumber'));
        }

      } catch (error) {
        console.error("Error fetching data services:", error);
      }
    };
    fetchData();
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
      <Stack direction="column" mb="auto" mt="8px">
        <Box
          ps={
            mini === false
              ? '20px'
              : mini === true && hovered === true
                ? '20px'
                : '16px'
          }
          pe={{ md: '16px', '2xl': '1px' }}
          ms={mini && hovered === false ? '-16px' : 'unset'}
        >
          {/*Contain links to all pages starting with System Admin*/}
          <Links mini={mini} hovered={hovered} routes={routes} />
        </Box>
      </Stack>
      {/*Empty Box?*/}
      <Box
        ps="20px"
        pe={{ md: '16px', '2xl': '16px' }}
        mt="60px"
        borderRadius="30px"
      >
      </Box>
      {/*User initial, role, and account number dropdown*/}
      <Flex mt="50px" mb="10px" justifyContent="center" alignItems="center">
        <Avatar
          _hover={{ cursor: 'pointer' }}
          color="white"
          name={(accountInfo?.firstName ?? "") + " " + (accountInfo?.lastName ?? "")}
          bg="#F26539"
          size="md"
          w="60px"
          h="60px"
        />
        <Box
          display={
            mini === false
              ? 'block'
              : mini === true && hovered === true
                ? 'block'
                : 'none'
          }
          ml='5px'

        >
          <Text color={textColor} fontSize="md" fontWeight="700" >
            {accountInfo && accountInfo.firstName && accountInfo.lastName && `${accountInfo.firstName} ${accountInfo.lastName}`}
          </Text>
          <Text color={textColor} fontSize="sm" fontWeight="400" >
            {accountInfo && accountInfo.type}
          </Text>
          <Text color={textColor} fontSize="sm" fontWeight="400" >
            {accountInfo?.isGuardianAdmin && currentAccountNumber}
          </Text>
          {!!!accountInfo?.accountNumbers &&
            <Text color={textColor} fontSize="sm" fontWeight="400" >
              {accountInfo?.accountNumber}
            </Text>
          }
        </Box>
      </Flex>
      <Flex mb="15px" ml='40px' display="center" width='200px' maxw='200px'>
        {accountInfo && accountInfo.isGuardianAdmin ? (
          <Select
            iconColor={textColorPrimary}
            textColor={textColorPrimary}
            fontWeight='500'
            fontSize='15px'
            id='accountSelector'
            variant='main'
            h='44px'
            maxh='44px'
            onChange={handleAccountNumberChange} // Handle onChange event             
          >{<option key={'currentAccount'} value={currentAccountNumber} style={{ backgroundColor: optionsBackGroundColor, color: textColorPrimary }}>
            {accountInfo?.accountNumbers?.filter(v => v.account_number === currentAccountNumber)[0]?.account_name}</option>}
            {accountInfo?.accountNumbers?.sort((a, b) => a.account_name.charCodeAt(0) - b.account_name.charCodeAt(0)).map(account => {
              if (account.account_number === currentAccountNumber) {
                return null;
              } else {
                return <option key={account.account_number} value={account.account_number} style={{ backgroundColor: optionsBackGroundColor, color: textColorPrimary }}>{account.account_name}</option>
              }
            }
            )}
          </Select>
        ) : accountInfo && accountInfo.accountNumbers != null && accountInfo.isAccountManagement ? (
          <Select
            iconColor={textColorPrimary}
            textColor={textColorPrimary}
            fontWeight='500'
            fontSize='15px'
            id='subAccount'
            variant='main'
            h='44px'
            maxh='44px'
            value={currentAccountNumber} // Set value here
            onChange={(e) => handleAccountNumberChange(e)} // Handle onChange event             
          >{<option key={'currentClientAccount'} value={currentAccountNumber} style={{ backgroundColor: optionsBackGroundColor, color: textColorPrimary }}>
            {accountInfo?.accountNumbers?.filter(v => v.account_number === currentAccountNumber)[0]?.account_name}</option>}
            {accountInfo.accountNumbers && accountInfo.accountNumbers.sort((a, b) => a.account_name.charCodeAt(0) - b.account_name.charCodeAt(0)).map((option) => {
              if (option.account_number === currentAccountNumber) {
                return null;
              } else {
                return (
                  <option key={option.account_number} value={option.account_number} style={{ backgroundColor: optionsBackGroundColor, color: textColorPrimary }}>
                    {option.account_name}
                  </option>
                )
              }
            }
            )}
          </Select>

        ) :
          !accountInfo?.isGuardianAdmin && !accountInfo.isAccountManagement ?
            <Select
              iconColor={textColorPrimary}
              textColor={textColorPrimary}
              fontWeight='500'
              fontSize='15px'
              id='subAccount'
              variant='main'
              h='44px'
              maxh='44px'
              value={currentAccountNumber} // Set value here
              onChange={(e) => handleAccountNumberChange(e)} // Handle onChange event             
            >{<option key={'currentClientAccount'} value={currentAccountNumber} style={{ backgroundColor: optionsBackGroundColor, color: textColorPrimary }}>
              {accountInfo?.accountNumbers?.filter(v => v.account_number === currentAccountNumber)[0]?.account_name}</option>}
              {accountInfo.accountNumbers && accountInfo.accountNumbers.sort((a, b) => a.account_name.charCodeAt(0) - b.account_name.charCodeAt(0)).map((option) => {
                if (option.account_number === currentAccountNumber) {
                  return null;
                } else {
                  return (
                    <option key={option.account_number} value={option.account_number} style={{ backgroundColor: optionsBackGroundColor, color: textColorPrimary }}>
                      {option.account_name}
                    </option>
                  )
                }
              }
              )}
            </Select>
            :
            <Flex mb="20px" justifyContent="center" alignItems="center">
            </Flex>
        }
      </Flex>
    </Flex>
  );
}

export default SidebarContent;
