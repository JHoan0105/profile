/*                                                         
=========================================================
* Certus Portal - v2.0.2
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/
// Guardian imports
import getAccountInfo from 'services/account/getAccountInfo';
import getGroupId from 'services/alertrules/getGroupId'


import SearchTableCreateImei from "views/admin/alertrules/view/components/SearchTableCreateImei";
import { columnsImei } from "views/admin/alertrules/view/variables/columnsCreateImei";
import SearchTableCreateBundle from "views/admin/alertrules/view/components/SearchTableCreateBundle";
import { columnsBundle } from "views/admin/alertrules/view/variables/columnsCreateBundle";


// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom'
import Card from "components/card/Card";

import React, { useEffect, useState, useReducer } from "react";
import { useLocation } from 'react-router-dom';

export const RULES = {
  UPDATE: 'UPDATE',
  RESET: 'RESET',
  SELECTDEVICE: 'SELECTDEVICE',
  SELECTPOOL: 'SELECTPOOL'
}

const rule = {
  relativeThreshold: true,
  thresholds: '',
  usageType: 'DEVICE',
  groupId: '',
  thresholdValue1: '',
  thresholdValue2: '',
  deviceList: []
}

const createRule = (rule, action) => {
  switch (action.type) {
    case RULES.RESET:
      return { ...rule, thresholdValue1: '', thresholdValue2: '', deviceList: [] }
    case RULES.UPDATE:
      console.log("UPDATE", { ...rule, [action.payload.name]: action.payload.value })
      return { ...rule, [action.payload.name]: action.payload.value }
    case RULES.SELECTDEVICE:
      {
        const unique = rule.deviceList.filter(i => i.imei !== action.payload.imei);
        const updatedRule = { ...rule, deviceList: [...unique, { imei: action.payload.imei, id: action.payload.id }] }
        if (action.payload?.imei) {
          updatedRule.deviceList.sort((a, b) => a.imei === b.imei ? 0 : a.imei < b.imei ? -1 : 0)
        }
        return updatedRule;
      }
    case RULES.SELECTPOOL:
      {
        const unique = rule.deviceList.filter(i => i.poolID !== action.payload.poolID);
        const updatedRule = {
          ...rule, deviceList: [...unique, { poolID: action.payload.poolID, name: action.payload.name , id: action.payload.id }]
        }
        if (action.payload?.poolID) {
          updatedRule.deviceList.sort((a, b) => a.poolID === b.poolID ? 0 : a.poolID < b.poolID ? -1 : 0)
        }
        return updatedRule
      }
    default: return rule
  }
}

// Default function
export default function CreateAlertRule() {
  const location = useLocation();
  const gid = location.state?.gid;
  const [ruleData, updateRuleData] = useReducer(createRule, rule)

  const nav = useNavigate();

  //Get JWT configuration
  const [jwtAccountInfo, setJwtAccountInfo] = useState({});
  // Account information 
  const [accountInfo, setAccountInfo] = useState({});


  useEffect(() => {
    console.log("ALERT PAGE GROUP ID ", gid)

    const fetchData = async () => {
      try {
        const fetchedJwtAccountInfo = getAccountInfo(); // Load accountInfo from JWT
        const fetchedAccountInfo = getAccountInfo(); // Load accountInfo from JWT

        setJwtAccountInfo(fetchedJwtAccountInfo);
        setAccountInfo(fetchedAccountInfo);

        //Get groupId
        const currentAccountNumber = localStorage?.getItem('accountNumber') || accountInfo.accountNumber;
        const response = await getGroupId(currentAccountNumber);
        const { id } = response;
        console.log("groupId:", id);
        updateRuleData({ type: RULES.UPDATE, payload: { name: 'groupId', value: id } })

      } catch (error) {
        console.error("Error fetching account data:", error);
        if (error?.toString() === 'Error: token expired') {
          nav('/')
        }
      }
    };
    fetchData();

  }, []);


  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1, lg: 1 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <Card px='0px' alignItems='center'>

          {ruleData.usageType === "DEVICE" &&
            <SearchTableCreateImei
              ruleData={ruleData}
              columnsData={columnsImei}
              updateRule={updateRuleData}
              accountInfo={accountInfo} jwtAccountInfo={jwtAccountInfo}

            />
          }
          {ruleData.usageType === "POOL" &&
            <SearchTableCreateBundle
              ruleData={ruleData}
              columnsData={columnsBundle}
              updateRule={updateRuleData}
              accountInfo={accountInfo} jwtAccountInfo={jwtAccountInfo}
            />
          }
        </Card>
      </SimpleGrid>
    </Box>
  );
}

