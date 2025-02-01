/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/
// Guardian imports
import View from "views/admin/dataservice/view/components/view";
import Delete from "views/admin/dataservice/view/components/delete";
import Assign from "views/admin/dataservice/view/components/assign";
import getAccountInfo from 'services/account/getAccountInfo'

// Chakra imports
import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import React from 'react';
import { useLocation } from "react-router-dom"; // Import useLocation hook

// Default function
export default function Settings() {
  //et the URL search parameters
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dataServiceId = searchParams.get("id");
  const isCreateDataService = dataServiceId === null ? true : false;
  const accountInfo = getAccountInfo();
  const currentAccountNumber = localStorage?.getItem('accountNumber') || accountInfo?.accountNumber;

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1, lg: 2 }}
        minChildWidth={{ base: "100%", md: "100%", lg: "500px", xl: "500px" }} // Minimum width for columns
        spacing={{ base: "20px", xl: "20px" }}>
        {/* Column Left */}
        <Flex direction='column' mt={{md:'50px', lg:'unset', xl:'unset'}}>
          <View dataServiceId={dataServiceId} />
        </Flex>
        {/* Column Right */}
        {!isCreateDataService && (
          <Flex direction='column'>
            <Assign dataServiceId={dataServiceId} accountNumber={currentAccountNumber} />
            {(searchParams && dataServiceId) && (<Flex mt={{sm:'45px', md:'60px',lg:'10px'}} ><Delete dataServiceId={dataServiceId} /></Flex>)}
          </Flex>
        )}
      </SimpleGrid>
    </Box>
  );
}

