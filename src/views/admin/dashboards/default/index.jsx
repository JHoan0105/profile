/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   ____  ____   ___  
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| |  _ \|  _ \ / _ \ 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || |  | |_) | |_) | | | |
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |  |  __/|  _ <| |_| |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___| |_|   |_| \_\\___/ 
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.horizon-ui.com/pro/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React from "react";
// Chakra imports
import { Flex, Grid, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Balance from "views/admin/dashboards/default/components/Balance";
import DailyTraffic from "views/admin/dashboards/default/components/DailyTraffic";
import MostVisitedTable from "views/admin/dashboards/default/components/MostVisitedTable";
import { VSeparator } from "components/separator/Separator";
import OverallRevenue from "views/admin/dashboards/default/components/OverallRevenue";
import ProfitEstimation from "views/admin/dashboards/default/components/ProfitEstimation";
import ProjectStatus from "views/admin/dashboards/default/components/ProjectStatus";
import YourCard from "views/admin/dashboards/default/components/YourCard";
import YourTransfers from "views/admin/dashboards/default/components/YourTransfers";
import MapCard from "views/admin/dashboards/default/components/MapCard";
import { tableColumnsMostVisited } from "views/admin/dashboards/default/variables/tableColumnsMostVisited";
import tableDataMostVisited from "views/admin/dashboards/default/variables/tableDataMostVisited.json";

export default function Default() {
  // Chakra Color Mode
  const paleGray = useColorModeValue("secondaryGray.400", "whiteAlpha.100");
  return (
    <Flex
      direction={{ base: "column", xl: "row" }}
      pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Flex direction='column' width='70%'>
      {  
        <Grid
          mb='20px'
          gridTemplateColumns={{ base: "repeat(2, 1fr)", "2xl": "720fr 350fr" }}
          gap='20px'
          display={{ base: "block", lg: "grid" }}>
          
          <Flex gridArea={{ base: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}>
            
            <OverallRevenue />
            
          </Flex>
          
          <Flex gridArea={{ base: "2 / 1 / 3 / 3", "2xl": "1 / 2 / 2 / 3" }}>
            <Balance />
          </Flex>
          <MapCard gridArea='1 / 2 / 2 / 3' />
        </Grid>
      }
        <Grid
          gap='20px'
          gridTemplateColumns={{
            md: "repeat(2, 1fr)",
            "2xl": "repeat(3, 1fr)",
          }}
          gridTemplateRows={{
            md: "repeat(2, 1fr)",
            "2xl": "1fr",
          }}
          mb='20px'>
          <Flex gridArea={{ md: "1 / 1 / 2 / 2", "2xl": "1 / 2 / 2 / 3" }}>
            {/*<ProjectStatus />*/}
          </Flex>
          <Flex gridArea={{ md: "1 / 2 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}>
            <ProfitEstimation />  
          </Flex>
          <Flex gridArea={{ md: " 2 / 1 / 3 / 3", "2xl": "1 / 3 / 2 / 4" }}>
            {/*<DailyTraffic />*/}
          </Flex>
        </Grid>
        {
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", "2xl": "350fr 720fr" }}
          gap='20px'
          display={{ base: "block", lg: "grid" }}>
          <Flex gridArea={{ base: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}>
            <YourTransfers />
          </Flex>
          <Flex gridArea={{ base: "2 / 1 / 3 / 3", "2xl": "1 / 2 / 2 / 3" }}>
            <MostVisitedTable
              tableData={tableDataMostVisited}
              columnsData={tableColumnsMostVisited}
            />
          </Flex>
        </Grid>
        }
      </Flex>
 
      <VSeparator
        mx='20px'
        bg={paleGray}
        display={{ base: "none", xl: "flex" }}
      />
      <YourCard
        maxW={{ base: "100%", xl: "400px" }}
        maxH={{ base: "100%", xl: "1170px", "2xl": "100%" }}
      />

    </Flex>
  );
}
