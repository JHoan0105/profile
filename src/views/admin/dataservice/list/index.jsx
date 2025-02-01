/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getDataServiceList from 'services/dataservicetemplate/getDataServiceList';

// Chakra imports
import { Flex } from "@chakra-ui/react";
import Card from "components/card/Card";
import React, { useEffect, useState } from "react"; 
import SearchTableDataService from "views/admin/dataservice/list/components/SearchTableDataServiceOverview";
import { columnsDataServiceOverview } from "views/admin/dataservice/list/variables/columnsDataServiceOverview";

export default function UsersOverview() {
    const [dataServiceList, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
              const dataServiceList = await getDataServiceList();
              setData(dataServiceList);
            } catch (error) {
                console.error("Error fetching accounts data:", error);
            }
        };
        fetchData();
    }, []);
    console.log(dataServiceList, 'service list');
  return (
    <Flex direction='column' pt={{ sm: "125px", lg: "75px" }}>
      <Card px='0px'>
        <SearchTableDataService
          tableData={dataServiceList || []}
          columnsData={columnsDataServiceOverview}
        />
      </Card>
    </Flex>

  );
}
