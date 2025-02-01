/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getAlertRulesList from 'services/alertrules/getAlertRulesList';
import getAccountInfo from 'services/account/getAccountInfo';

// Chakra imports
import { Flex } from "@chakra-ui/react";
import Card from "components/card/Card";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import SearchTableAlertRules from "views/admin/alertrules/list/components/SearchTableAlertRulesOverview";
import { columnsAlertRulesOverview } from "views/admin/alertrules/list/variables/columnsAlertRulesOverview";

export default function AlertOverview() {
  const [alertRulesList, setData] = useState([]);
  const accountInfo = getAccountInfo();
  const currentAccountNumber = localStorage?.getItem('accountNumber') || accountInfo?.accountNumber;
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAlertRulesList(currentAccountNumber);
        setData(response);
        console.log('Alert rules list: ', response);
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
        <SearchTableAlertRules
          tableData={alertRulesList || []}
          columnsData={columnsAlertRulesOverview}
        />
      </Card>
    </Flex>

  );
}
