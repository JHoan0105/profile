/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/
// Guardian imports
import View from "views/admin/devices/view/components/view";

// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import React from 'react';
import { useLocation } from "react-router-dom"; // Import useLocation hook

// Default function
export default function Settings() {
  //et the URL search parameters
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const deviceId = searchParams.get("id");
  const accNum = searchParams.get("account");

  // Pass the device as a reference
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1, lg: 2 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <View deviceId={deviceId} account={accNum} />
      </SimpleGrid>
    </Box>
  );
}

