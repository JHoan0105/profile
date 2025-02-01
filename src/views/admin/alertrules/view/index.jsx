/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v2.0.2
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/
// Guardian imports
import Thresholds from "views/admin/alertrules/view/components/thresholds";
import SearchTableImei from "views/admin/alertrules/view/components/SearchTableImei";
import { columnsImei } from "views/admin/alertrules/view/variables/columnsImei";
import SearchTableEmail from "views/admin/alertrules/view/components/SearchTableEmail";
import { columnsEmail } from "views/admin/alertrules/view/variables/columnsEmail";
import SearchTableBundle from "views/admin/alertrules/view/components/SearchTableBundle";
import { columnsBundle } from "views/admin/alertrules/view/variables/columnsBundle";

import getAccountInfo from 'services/account/getAccountInfo'
// Chakra imports
import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation hook

import {PATH_NAME } from 'variables/constants'

// Default function
export default function Settings() {
  //Get the URL search parameters
  const location = useLocation();
  const rowData = location.state?.rowData;                                                  // ALERT RULE SELECTED DATA
  const account = getAccountInfo();

  const [imeiList] = useState([]);                                                          // ALERT IMEI DEVICE LIST 
  const [emailList] = useState([]);                                                         // EMAIL RECIPIENT LIST
  const [imeiBundle] = useState([]);                                                        // ALERT POOL LIST
  const [userAllowed] = useState(account?.isAlertManagement|| account?.isGuardianAdmin)

  useEffect(() => {
    if (!account?.isAlertManagement) {
      if (!account?.isGuardianAdmin)
        window.location.href = PATH_NAME.MAIN_DASHBOARD
    }
  })

  return (<>
    { userAllowed ?
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <SimpleGrid
          mb='20px'
          columns={{ sm: 1, md: 1, lg: 2 }}
          spacing={{ base: "20px", xl: "20px" }}>
          <Flex
            direction='column'
            mt={{sm:"-5px",md:"45px", lg:"0px"}}
          >
            {rowData?.usageType === 'DEVICE' &&
                <SearchTableImei
                  rowData={rowData}
                  tableData={imeiList}
                  columnsData={columnsImei}
                />
            }
            {rowData?.usageType === 'POOL' &&
                <SearchTableBundle
                  rowData={rowData}
                  tableData={imeiBundle}
                  columnsData={columnsBundle}
                />
            }
            <Flex
              mt={{ sm: "45px", md: "60px", lg: "10px" }}
              mb={{ sm: "25px", md:"40px" }}
            >
              <Thresholds
                rowData={rowData}
              />
            </Flex>
          </Flex>

          <Flex direction='column'>
              <SearchTableEmail
                rowData={rowData}
                tableData={emailList}
                columnsData={columnsEmail}
            />
              </Flex>
        </SimpleGrid>
      </Box >
    :null}
  </>);
}

