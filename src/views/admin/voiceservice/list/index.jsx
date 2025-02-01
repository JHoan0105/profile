/*                                                                                                                                                                                                                                                                                                                             
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import getVoiceServiceListByAccountNumber from 'services/voiceServiceTemplate/getVoiceServiceListByAccountNumber.js'
import getAccountInfo from 'services/account/getAccountInfo';
import getVoiceServiceList from 'services/voiceServiceTemplate/getVoiceServiceList.js';

// Chakra imports
import { Flex } from "@chakra-ui/react";
import Card from "components/card/Card";
import React, { useEffect, useState } from "react";
import SearchTableVoiceService from "views/admin/voiceservice/list/components/SearchTableVoiceServiceOverview";
import { columnsVoiceServiceOverview } from "views/admin/voiceservice/list/variables/columnsVoiceServiceOverview";

export default function VoiceServiceOverview() {
  const [voiceServiceList, setData] = useState([]);
  const accountInfo = getAccountInfo();
  const currentAccountNumber = localStorage?.getItem('accountNumber') || accountInfo?.accountNumber;

  useEffect(() => {
    (async () => {
      // This endpoint returns Voice Service Templates that are allowed to be assigned to a specific account number
      // if GuardianAdmin use get all
      let vList;
      if (accountInfo?.isGuardianAdmin) {
        vList = await getVoiceServiceList();
      } else {
        vList = await getVoiceServiceListByAccountNumber(currentAccountNumber);
      }
      if (vList) {
        setData(vList);
      }
    })()
  }, []);
  console.log('service list');
  return (
    <Flex direction='column' pt={{ sm: "125px", lg: "75px" }}>
      <Card px='0px'>
        <SearchTableVoiceService
          tableData={voiceServiceList || []}
          columnsData={columnsVoiceServiceOverview}
        />
      </Card>
    </Flex>

  );
}
