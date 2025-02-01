/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/
// Guardian imports
import DeviceUsageDetail from "views/main/usages/view/components/usages";
import UsagesChart from "views/main/usages/view/components/usagesChart";

// Chakra imports
import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import Card from "components/card/Card";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation hook

// Default function
export default function Settings() {
  //Get the URL search parameters
  const location = useLocation();
  const rowData = location.state?.rowData;
  const searchParams = new URLSearchParams(location.search);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1, lg: 2 }}
        spacing={{ base: "20px", xl: "20px" }}>
        {/* Column Left */}
        <Flex direction='column'>
          <Card px='0px' mt='20px'>
            <DeviceUsageDetail
              rowData={rowData}
            />
          </Card>
        </Flex>
        {/* Column Right */}
        <Flex direction='column'>
          <Card px='0px' mt='20px'>
            <UsagesChart
              rowData={rowData}
            />
          </Card>
        </Flex>
      </SimpleGrid>
    </Box>
  );
}

