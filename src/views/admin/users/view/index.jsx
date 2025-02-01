/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.1.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';
import getAccountById from 'services/account/getAccountById';

// Chakra imports
import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import Block from "views/admin/users/view/components/Block";
import AccountTable from "views/admin/users/view/components/AccountTable";
import Delete from "views/admin/users/view/components/Delete";
import AccountSetting from "views/admin/users/view/components/AccountSetting";
import Permissions from "views/admin/users/view/components/Permissions";
import ChangePassword from "views/admin/users/view/components/ChangePassword";
import NewAccount from "views/admin/users/view/components/NewAccount";
import Profile from "views/admin/users/view/components/Profile";
import React, { useState, useEffect, useReducer } from 'react';
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation hook
import { columnsAccountTable } from './variables/columnsAccountTable'

// 
export const GUARDIANACC = '10000393'

const MANAGE_ACCOUNT = {
  UPDATE: 'UPDATE',
  SORT: 'SORT',
  ADDSORT: 'ADDSORT'
}

const manageaccounts = [];

const updateAccounts = (account, action) => {
  switch (action.type) {
    case (MANAGE_ACCOUNT.UPDATE): {
      return action.payload
    }
    case (MANAGE_ACCOUNT.SORT): {
      account = account.sort((a, b) => {
        if (a.account_number === action.payload?.accountnumber) {
          return -1
        } else if (!!!action.payload.subaccount?.filter(v => v?.account_number === a?.account_number)[0]) {
          return -1
        } else {
          return 0
        }
      }).filter(v => v?.account_number !== action.payload.account?.account_number)
      account.unshift(action.payload.account)
      return [...account.reverse()]
    }
    case MANAGE_ACCOUNT.ADDSORT: {
      account = account.sort((a, b) => {
        if (a.account_number === action.payload?.accountnumber) {
          return -1
        } else if (!!!action.payload.subaccount?.filter(v => v?.account_number === a?.account_number)[0]) {
          return -1
        } else {
          return 0
        }
      }).filter(v => v?.account_number !== action.payload.account?.account_number)
      account.push(action.payload.account)
      return [...account.reverse()]
    }
    default: return account;
  }
}
export default function Settings() {
  // Get the URL search parameters
  const location = useLocation();
  const currentAccountNumber = localStorage?.getItem('accountNumber')
  const isAdmin = location.state?.admin;                                            // Permission on View User state
  const userId = location.state?.userId                                             // View user info state

  const nav = useNavigate();
  //Get JWT configuration
  const [jwtAccountInfo, setJwtAccountInfo] = useState({});                         // The sign-in user permission and account numbers

  // Account information 
  const [accountInfo, setAccountInfo] = useState({});                               // the retrieved user's and account numbers
  const [subAccounts, setSubAccounts] = useState([])                                // user's subaccounts

  const [manageAccounts, updateManageAccount] = useReducer(updateAccounts, manageaccounts)

  const updateSubAccount = (accountnumber) => {
    const tmp = subAccounts.sort((a, b) => {
      if (a?.account_number === accountnumber) {
        return -1
      } else
        return 0
    }).filter(v => v?.account_number !== accountnumber)
    const removed = subAccounts?.filter(v=> v?.account_number === accountnumber)[0]
    setSubAccounts(() => tmp)
    updateManageAccount({ type: MANAGE_ACCOUNT.SORT, payload: { accountnumber: accountnumber, account: removed, subaccount:tmp } })
  }
  const addSubAccount = (accountnumber) => {
    const tmp = [...subAccounts]
    tmp?.unshift(manageAccounts?.filter(v => v?.account_number === accountnumber)[0])
    setSubAccounts(() => tmp)
    updateManageAccount({ type: MANAGE_ACCOUNT.ADDSORT, payload: { accountnumber: accountnumber, account: manageAccounts?.filter(v => v?.account_number === accountnumber)[0], subaccount: tmp } })
  }

  useEffect(() => {
    console.log("USER", isAdmin, userId)
    const fetchData = async () => {
      try {
        let fetchedAccountInfo = [];              // sign-in user account info
        let uniqueCombinedArray = [];             // list of combined account numbers temp array
        let filteredAccounts = []                 // filtered account numbers
        const fetchedJwtAccountInfo = await getAccountInfo(); // Load accountInfo from JWT
        if ((fetchedJwtAccountInfo?.isGuardianAdmin || fetchedJwtAccountInfo?.isAccountManagement) && !!userId) {
          fetchedAccountInfo = await getAccountById(userId); // Load from request
          const combinedArray = await !!fetchedAccountInfo?.accountNumbers ? fetchedAccountInfo?.accountNumbers?.sort((a, b) => a.account_name.charCodeAt(0) - b.account_name.charCodeAt(0))
            ?.concat(fetchedJwtAccountInfo?.accountNumbers.sort((a, b) => a.account_name.charCodeAt(0) - b.account_number.charCodeAt(0)))
            : [{ account_name: fetchedAccountInfo?.accountName, account_number: fetchedAccountInfo?.accountNumber }]
            ?.sort((a, b) => a.account_name.charCodeAt(0) - b.account_name.charCodeAt(0))
            ?.concat(fetchedJwtAccountInfo?.accountNumbers.sort((a, b) => a.account_name.charCodeAt(0) - b.account_name.charCodeAt(0)));
          uniqueCombinedArray = Array.from(
            new Map(combinedArray?.map(item =>[item.account_number, item] )).values()
          );
          uniqueCombinedArray?.forEach(v => {
            const tmp = fetchedJwtAccountInfo?.accountNumbers?.filter(i => i.account_number === v.account_number)[0]
            if (!!tmp) {
              filteredAccounts.push(tmp)
            }
          })

        }

        setJwtAccountInfo({
          ...fetchedJwtAccountInfo,
          accountNumbers: uniqueCombinedArray == false ? fetchedJwtAccountInfo.accountNumbers : uniqueCombinedArray
        });
        setAccountInfo({
          ...fetchedAccountInfo,
          accountNumbers: !!fetchedAccountInfo?.accountNumbers ? fetchedAccountInfo?.accountNumbers : [{ account_name: fetchedAccountInfo?.accountName, account_number: fetchedAccountInfo?.accountNumber }],
          accountName: fetchedAccountInfo?.accountName || ''
        });
        // set current user's subaccounts
        setSubAccounts(() => !!fetchedAccountInfo?.accountNumbers ?fetchedAccountInfo?.accountNumbers : [{ account_name: fetchedAccountInfo?.accountName, account_number: fetchedAccountInfo?.accountNumber }])
        updateManageAccount({ type: MANAGE_ACCOUNT.UPDATE, payload: !!uniqueCombinedArray == false ? fetchedJwtAccountInfo.accountNumbers : filteredAccounts })

      } catch (error) {
        console.error("Error fetching account data:", error);
        if (error?.toString() === 'Error: token expired') {
          nav('/')
        }
      }
    };
    fetchData();
  }, [isAdmin, userId]);

  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1, lg: 2 }}
        spacing={{ base: "20px", xl: "20px" }}>
        {/* Column Left */}
        <Flex direction='column'>
          <Profile accountInfo={!!!userId ? jwtAccountInfo : accountInfo} />
          <AccountSetting userId={!!userId} accountInfo={accountInfo} setAccountInfo={!!!userId ? setJwtAccountInfo : setAccountInfo} jwtAccountInfo={jwtAccountInfo} />
          {!isAdmin && <ChangePassword mb='20px' />} {/* Render ChangePassword component only if isAdmin is true */}
          {
            ((jwtAccountInfo?.isGuardianAdmin || jwtAccountInfo?.isAccountManagement) && accountInfo.new) && <NewAccount accountInfo={accountInfo} jwtAccountInfo={jwtAccountInfo} mb='20px' />
          } {/* Render ChangePassword component only if isAdmin is true */}
          {
            (((jwtAccountInfo?.isGuardianAdmin && !accountInfo?.isGuardianAdmin) ||
              (jwtAccountInfo?.isAccountManagement && !accountInfo?.isGuardianAdmin)) &&
              !!userId && !accountInfo.new) && <AccountTable columnsData={columnsAccountTable}
              tableData={manageAccounts || []} subAccounts={subAccounts || []} setSubAccounts={updateSubAccount} setAddSubAccount={ addSubAccount} useremail={accountInfo?.email} adminAccount={currentAccountNumber} />
          }
        </Flex>
        {/* Column Right */}
        <Flex direction='column'>
          <Permissions accountInfo={!!!userId ? jwtAccountInfo : accountInfo} jwtAccountInfo={jwtAccountInfo} mb='20px' />
          {((jwtAccountInfo?.isGuardianAdmin) && ( // Conditionally render if isGuardianAdmin
            <>
              {userId !== null && jwtAccountInfo.isGuardianAdmin ? ( //Render if not your own account.
                <>
                  <Block accountInfo={!!!userId ? jwtAccountInfo : accountInfo} jwtAccountInfo={jwtAccountInfo} mb='20px' />
                </>
              ) : (
                null
              )}
              {userId !== null && jwtAccountInfo.isGuardianAdmin ? ( //Render if editing a user or not your own account.
                <>
                  <Delete accountInfo={accountInfo} mb='20px' />
                </>
              ) : (
                null
              )}
            </>
          ))}
        </Flex>
      </SimpleGrid>
    </Box>
  );
}

