/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAccountList from 'services/account/getAccountList';
import getAccountInfo from 'services/account/getAccountInfo';

// Chakra imports
import { Flex } from "@chakra-ui/react";
import Card from "components/card/Card";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import SearchTableUsers from "views/admin/users/list/components/SearchTableUsersOverivew";
import { columnsDataUsersOverview } from "views/admin/users/list/variables/columnsDataUsersOverview";

export default function UsersOverview() {
  const [accountList, setData] = useState([]);
  const accountInfo = getAccountInfo();
  const nav = useNavigate();
  const currentAccountNumber = localStorage?.getItem('accountNumber') || accountInfo?.accountNumber;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountList = await getAccountList(currentAccountNumber);
        setData(accountList);
      } catch (error) {
        console.error("Error fetching accounts data:", error);
        if (error?.toString() === 'Error: token expired') {
          nav('/')
        }
      }
    };
    fetchData();
  }, []);

  console.log("currentAccountNumber: ", currentAccountNumber);

  return (
    <Flex direction='column' pt={{ sm: "125px", lg: "75px" }}>
      <Card px='0px'>
        <SearchTableUsers
          tableData={accountList || []}
          columnsData={columnsDataUsersOverview}
        />
      </Card>
    </Flex>
  );
}
