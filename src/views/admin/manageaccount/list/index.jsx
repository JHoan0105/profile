/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAllAccountNumbers from 'services/manageAccounts/getAllAccountNumbers'

// Chakra imports
import { Flex } from "@chakra-ui/react";
import Card from "components/card/Card";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import SearchTableAccounts from "views/admin/manageaccount/list/components/SearchTableAccountsOverview";
import { columnsAccountsOverview } from "views/admin/manageaccount/list/variables/columnsAccountsOverview";

export default function AccountOverview() {
  const [accountList, setData] = useState([]);
  const nav = useNavigate();

  useEffect(() => {

    const fetchData = async () => {
      try {
        let accountList = await getAllAccountNumbers();
        setData(accountList.sort((a,b)=> a.account_name.charCodeAt(0)-b.account_name.charCodeAt(0)));

      } catch (error) {
        console.error("Error fetching accounts data:", error);
        if (error?.toString() === 'Error: token expired') {
          nav('/')
        }
      }
    };
    fetchData();
  }, []);


  return (
    <Flex direction='column' pt={{ sm: "125px", lg: "75px" }}>
      <Card px='0px'>
        <SearchTableAccounts
          tableData={accountList || []}
          columnsData={columnsAccountsOverview}
        />
      </Card>
    </Flex>
  );
}
