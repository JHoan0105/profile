/*!
                                                                                                                                                                                                                                                                                                                              
=========================================================
* Guardian Mobility Dashboard
=========================================================

* Copyright © 2024 Guardian Mobility All Rights Reserved (https://www.guardianmobility.com/)

* Designed and Coded by Guy Desbiens

=========================================================

*/

// Chakra imports
import { Flex } from "@chakra-ui/react";
import Card from "components/card/Card";
import React from "react";
import SearchTableSubscriptions from "views/admin/dashboards/subscriptions/components/SearchTableSubscriptions";
import { columnsDataSubscriptions } from "views/admin/dashboards/subscriptions/variable/columnsDataSubscriptions";
import tableDataSubscriptions from "views/admin/dashboards/subscriptions/variable/tableDataSubscriptions.json";

export default function SearchUser() {
  return (
    <Flex direction='column' pt={{ sm: "125px", lg: "75px" }}>
      <Card px='0px'>
        <SearchTableSubscriptions
          tableData={tableDataSubscriptions}
          columnsData={columnsDataSubscriptions}
        />
      </Card>
    </Flex>
  );
}
