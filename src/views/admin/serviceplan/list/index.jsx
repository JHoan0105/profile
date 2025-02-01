/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/
// Guardian imports
import getBundleListByAccountNumber from 'services/serviceplan/getBundleListByAccountNumber';
import getAccountInfo from 'services/account/getAccountInfo';

// Chakra imports
import { Flex } from "@chakra-ui/react";
import Card from "components/card/Card";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SearchServicePlanOverview from "views/admin/serviceplan/list/components/SearchServicePlanOverview";
import { columnsServicePlansOverview } from "views/admin/serviceplan/list/variables/columnsServicePlansOverview";


export default function BundleOverview() {
  const [bundleListByAccountNumber, setData] = useState([]);
  const accountInfo = getAccountInfo();
  const nav = useNavigate();
  const currentAccountNumber = localStorage?.getItem('accountNumber') || accountInfo?.accountNumber;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bundleListByAccountNumber = await getBundleListByAccountNumber(currentAccountNumber);
        if (bundleListByAccountNumber) {
          setData(bundleListByAccountNumber);
        }
        console.log("bundleListByAccountNumber", bundleListByAccountNumber);
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
        <SearchServicePlanOverview
          tableData={bundleListByAccountNumber || []}
          columnsData={columnsServicePlansOverview}
        />
      </Card>
    </Flex>

  );
}