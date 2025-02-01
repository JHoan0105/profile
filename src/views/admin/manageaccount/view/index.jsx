/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';
import getAccountList from 'services/account/getAccountList';
 
// Chakra imports
import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import Delete from "views/admin/manageaccount/view/components/Delete";
import AccountContact from "views/admin/manageaccount/view/components/AccountContact";
import Profile from "views/admin/manageaccount/view/components/Profile";
import Card from "components/card/Card";
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation hook
import SearchTableAccountUsers from "views/admin/manageaccount/view/components/AccountUsers/components/SearchTableAccountUsersOverview";
import { columnsAccountUsersOverview } from "views/admin/manageaccount/view/components/AccountUsers/variables/columnsAccountUsersOverview";

// Default function
export default function AccountSettings() {
  // Get the URL search parameters
  const location = useLocation();

  const selectedAccount = location.state?.selectedAccount;
  const accountName = location.state?.accountName;

  const nav = useNavigate();
  //Get JWT configuration
  const [userAccount, setUserAccount] = useState();
  // Account information 
  const [accountInfo, setAccountInfo] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await getAccountInfo();

        const users = await getAccountList(selectedAccount)

        setAccountInfo({
          accountNumbers: info?.accountNumbers,
          accountNumber: selectedAccount,
          accountName: info?.accountNumbers?.filter(v => v.account_number === selectedAccount)[0].account_name,
        })
        console.log("USERS", users)
        setUserAccount(
          users
        )

      } catch (error) {
        console.error("Error fetching account data:", error);
        if (error?.toString() === 'Error: token expired') {
          nav('/')
        }
      }
    };
    fetchData();
  }, [selectedAccount]);

  // Chakra Color Mode
  return (
    <>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        {/* Main Fields */}
        <SimpleGrid
          mb='20px'
          columns={{ sm: 1, md: 1, lg: 2 }}
          spacing={{ base: "20px", xl: "20px" }}>
          {/* Column Left */}
          <Flex direction='column'>
            <Profile accountName={accountName} accountNumber={selectedAccount} />
            <AccountContact accountInfo={accountInfo} setAccountInfo={setAccountInfo} jwtAccountInfo={{}} />
          </Flex>
          {/* Column Right */}
          <Flex direction='column'>
            <Card mb='20px'>
              <SearchTableAccountUsers
                tableData={userAccount || []}
                columnsData={columnsAccountUsersOverview}
              />
            </Card>
            <Delete accountInfo={ accountInfo} accountnumber={selectedAccount} accountname={accountName} users={userAccount?.length>0 ? true: false} />
          </Flex>
        </SimpleGrid>
      </Box>

    </>
  );
}

