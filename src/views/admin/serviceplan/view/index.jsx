/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/
// Guardian imports
import View from "views/admin/serviceplan/view/components/view";
import Delete from "views/admin/serviceplan/view/components/delete";

// Chakra imports
import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import React from 'react';
import { useLocation } from "react-router-dom"; // Import useLocation hook

// Default function
export default function ViewBundle() {
  //Get the URL search parameters
  const location = useLocation();
  const rowData = location.state?.rowData;
  const isCreateCertusBundle = rowData === undefined ? true : false;

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1, lg: 2 }}
        spacing={{ base: "20px", xl: "20px" }}>
        {/* Column Left */}
        <Flex direction='column'>
          <View rowData={rowData} />
        </Flex>
        {/* Column Right - Render only if isCreateCertusBundle is false */}
        {!isCreateCertusBundle && (
          <Flex direction='column'>
            <Delete rowData={rowData} />
          </Flex>
        )}
      </SimpleGrid>
    </Box>
  );
}

